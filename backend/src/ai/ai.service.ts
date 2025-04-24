import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
import OpenAI from 'openai';
import { IadCreatorData } from 'src/types/interface';
import * as fs from 'fs';
import * as path from 'path';
import { Console } from 'console';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openaiApiKey: string;
  private readonly openai: any;

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY')!;
    
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: this.openaiApiKey,
    });
  }

  /**
   * Generate a new advertisement from scratch
   * @param prompt User's description for the ad
   * @param adCreatorData Image and template data
   * @param userEmail User's email for credit tracking
   */
  async generate(
    prompt: string,
    adCreatorData: IadCreatorData,
    userEmail: string,
  ): Promise<{ imageData: string; aspectRatio: string; promptText: string }> {
    try {
      // Validate required data
      this.validateAdCreatorData(adCreatorData);

      // Process template images - convert URLs to base64 if needed
      adCreatorData = await this.preprocessAdData(adCreatorData);

      // Generate the design prompt
      const designPrompt = await this.generatePrompt(prompt, adCreatorData);
      
      // Generate the image using the prompt
      const imageData = await this.generateImage(designPrompt, adCreatorData);

      // Update user credits
      await this.updateUserCredits(userEmail);

      return {
        imageData,
        aspectRatio: adCreatorData.settings?.aspectRatio || '9:16',
        promptText: designPrompt,
      };
    } catch (error) {
      this.handleError('ad generation', error);
    }
  }

  /**
   * Edit an existing advertisement
   * @param prompt User's edit instructions
   * @param adCreatorData Image settings
   * @param currentImage The image to be edited
   * @param userEmail User's email for credit tracking
   */
  async edit(
    prompt: string,
    adCreatorData: IadCreatorData,
    currentImage: string,
    userEmail: string,
  ): Promise<{ imageData: string; aspectRatio: string; promptText: string }> {
    try {
      this.logger.log(`Processing edit request with prompt: ${prompt?.substring(0, 50)}...`);

      // Validate image data
      if (!currentImage) {
        throw new BadRequestException('No image provided for editing');
      }

      // Clean the base64 image data
      const cleanCurrentImage = this.cleanBase64Data(currentImage);
      
      // Preprocess any template data if needed
      adCreatorData = await this.preprocessAdData(adCreatorData);

      // Generate edit-specific prompt
      const editPrompt = await this.generateEditPrompt(prompt, cleanCurrentImage, adCreatorData);
      
      // Generate the edited image
      const imageData = await this.editImage(
        editPrompt, 
        cleanCurrentImage,
        adCreatorData
      );

      // Update user credits
      await this.updateUserCredits(userEmail);

      return {
        imageData,
        aspectRatio: adCreatorData.settings?.aspectRatio || '3:2',
        promptText: editPrompt,
      };
    } catch (error) {
      this.handleError('image editing', error);
    }
  }

  /**
   * Generate a new image using OpenAI's GPT-4 image model
   */
  private async generateImage(
    prompt: string,
    adCreatorData: IadCreatorData
  ): Promise<string> {
    try {
      const { aspectRatio } = adCreatorData.settings || {};
      
      // Determine image size based on aspect ratio
      let size = '1024x1024'; // default square
      if (aspectRatio) {
        switch (aspectRatio) {
          case '16:9':
            size = '1536x1024';
            break;
          case '9:16':
            size = '1024x1536';
            break;
          case '4:5':
            size = '1024x1280'; // Approximate 4:5 ratio
            break;
          default:
            size = '1024x1024'; // Default to square 1:1
        }
      }

      // Generate image with GPT Image model
      const response = await this.openai.images.generate({
        model: "gpt-image-1",
        prompt: `${prompt}\n\nCreate a professional advertisement using the given product and template images as reference.`,
        n: 1, // Generate one image
        quality: "low",
        size: size as any,
      });
      console.log("-------------------------------------")
      console.log(response)
      console.log("-------------------------------------")
      // Process the response to get the image data
      if (!response.data || response.data.length === 0) {
        throw new Error('No image was generated');
      }

      // Check if response has base64 data
      const imageData = response.data[0]?.b64_json;
      if (imageData) {
        // Base64 data is directly available
        this.logger.log('Successfully received base64 image data');
        return imageData;
      }
      
      // Fallback to URL if base64 is not available
      const imageUrl = response.data[0]?.url;
      if (!imageUrl) {
        throw new Error('No image data returned');
      }
      
      // Fetch the image from the URL and convert to base64
      this.logger.log(`Fetching image from URL: ${imageUrl.substring(0, 30)}...`);
      const imageDataFromUrl = await this.fetchImageAsBase64(imageUrl);
      
      return imageDataFromUrl;
    } catch (error) {
      this.logger.error('Error generating image', error);
      throw new Error(`Failed to generate image: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Edit an existing image using OpenAI's GPT-4 image model
   */
  private async editImage(
    prompt: string,
    currentImage: string,
    adCreatorData: IadCreatorData
  ): Promise<string> {
    try {
      const { aspectRatio } = adCreatorData.settings || {};
      
      // Determine image size based on aspect ratio
      let size = '1024x1024'; // default square
      if (aspectRatio) {
        switch (aspectRatio) {
          case '16:9':
            size = '1536x1024';
            break;
          case '9:16':
            size = '1024x1536';
            break;
          case '4:5':
            size = '1024x1280'; // Approximate 4:5 ratio
            break;
          default:
            size = '1024x1024'; // Default to square 1:1
        }
      }
      
      // Convert base64 to buffer for API
      const imageBuffer = this.convertBase64ToBuffer(currentImage);
      
      // Create a FormData or buffer for the image
      const imageFile = await this.createImageFile(imageBuffer);

      // Edit image with GPT Image model
      const response = await this.openai.images.edit({
        model: "gpt-image-1",
        image: imageFile,
        prompt: prompt,
        n: 1, // Generate one image
        size: size as any,
      });

      // Process the response to get the image data
      if (!response.data || response.data.length === 0) {
        throw new Error('No edited image was generated');
      }

      // Get image URL and fetch the image data
      const imageUrl = response.data[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned');
      }
      
      // Fetch the image from the URL and convert to base64
      const imageData = await this.fetchImageAsBase64(imageUrl);
      
      return imageData;
    } catch (error) {
      this.logger.error('Error editing image', error);
      throw new Error(`Failed to edit image: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Fetch an image from URL and convert to base64
   */
  private async fetchImageAsBase64(imageUrl: string): Promise<string> {
    try {
      // Use node-fetch or axios to download the image
      const axios = require('axios');
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'arraybuffer',
      });
      
      // Convert the image to base64
      const buffer = Buffer.from(response.data);
      return buffer.toString('base64');
    } catch (error) {
      this.logger.error('Error fetching image', error);
      throw new Error(`Failed to fetch image: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Create a File object from Buffer for OpenAI API
   */
  private async createImageFile(buffer: Buffer): Promise<File | any> {
    try {
      // Use the toFile utility from OpenAI if available
      if (typeof OpenAI.toFile === 'function') {
        return await OpenAI.toFile(buffer, 'image.png', { type: 'image/png' });
      }
      
      // Create a Blob and then a File object (for Node.js environments)
      return new File([buffer], 'image.png', { type: 'image/png' });
    } catch (error) {
      // If File API is not available (older Node.js versions), return buffer or readable stream
      this.logger.warn('File API not available, using alternative approach');
      
      // Create a readable stream from buffer
      const { Readable } = require('stream');
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      
      return {
        stream: () => stream,
        name: 'image.png',
        type: 'image/png',
      };
    }
  }

  /**
   * Generate design prompt for new ad creation
   */
  private async generatePrompt(
    prompt: string,
    adCreatorData: IadCreatorData,
  ): Promise<string> {
    try {
      // Get image data and ensure proper base64 formatting
      const uploadedImage = this.cleanBase64Data(adCreatorData.uploadedImages[0]);
      const templateImage = this.cleanBase64Data(adCreatorData.selectedTemplateUrl[0]);

      // Create prompt text for design generation
      const promptText = `Generate an advertisement that combines the product image with the template style.
      
      Design parameters:
      - Creativity: ${adCreatorData.settings?.creativityLevel || 50}%
      - Detail: ${adCreatorData.settings?.detailLevel || 50}%
      - Platform: ${adCreatorData.settings?.targetPlatform || 'Instagram'}
      - Aspect ratio: ${adCreatorData.settings?.aspectRatio || '9:16'}
      
      Additional guidance: ${prompt || 'Create a professional advertisement'}`;

      return promptText;
    } catch (error) {
      this.logger.error('Error generating design prompt', error);
      throw new Error(`Failed to generate design prompt: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Generate edit-specific prompt for editing existing ad
   */
  private async generateEditPrompt(
    prompt: string,
    currentImage: string,
    adCreatorData: IadCreatorData,
  ): Promise<string> {
    try {
      // Create prompt text for edit operation
      const editPrompt = `Edit this advertisement according to these instructions: ${prompt}
      
      Edit parameters:
      - Target platform: ${adCreatorData.settings?.targetPlatform || 'Instagram'}
      - Aspect ratio: ${adCreatorData.settings?.aspectRatio || '3:2'}
      
      Keep the same overall style and composition, but make the specific changes requested.`;

      return editPrompt;
    } catch (error) {
      this.logger.error('Error generating edit prompt', error);
      return `Edit the advertisement according to these instructions: ${prompt}`;
    }
  }

  /**
   * Convert base64 string to Buffer
   */
  private convertBase64ToBuffer(base64String: string): Buffer {
    // Clean the base64 string
    const cleanBase64 = this.cleanBase64Data(base64String);
    return Buffer.from(cleanBase64, 'base64');
  }

  /**
   * Validate ad creator data has required fields
   */
  private validateAdCreatorData(adCreatorData: IadCreatorData): void {
    if (!adCreatorData || !adCreatorData.uploadedImages || !adCreatorData.uploadedImages.length) {
      throw new BadRequestException('No product images provided');
    }

    if (!adCreatorData.selectedTemplateUrl || !adCreatorData.selectedTemplateUrl.length) {
      throw new BadRequestException('No template selected');
    }
  }

  /**
   * Handle errors in a consistent way
   */
  private handleError(process: string, error: any): never {
    this.logger.error(`Error in ${process}`, error);
    
    if (error instanceof BadRequestException) {
      throw error;
    }
    
    throw new Error(`Failed to ${process}: ${error.message || 'Unknown error'}`);
  }

  /**
   * Update user credits after successful operations
   */
  private async updateUserCredits(userEmail: string): Promise<void> {
    try {
      const userInfo = await this.userModel.findOne({ email: userEmail });

      if (!userInfo) {
        this.logger.warn(`User not found: ${userEmail}`);
        return;
      }

      await this.userModel.updateOne(
        { email: userEmail },
        { $inc: { creditsUsed: 1 } },
      );

      this.logger.log(`Credits updated successfully for user: ${userEmail}`);
    } catch (error) {
      this.logger.error(`Error updating user credits: ${error.message}`, error.stack);
      // Don't throw here to avoid interrupting the main flow
    }
  }

  /**
   * Preprocess ad data and load template images
   */
  private async preprocessAdData(adCreatorData: IadCreatorData): Promise<IadCreatorData> {
    // Create a copy to avoid modifying the original
    const processedData = { ...adCreatorData };

    // Process template URLs if they exist
    if (processedData.selectedTemplateUrl?.length) {
      for (let i = 0; i < processedData.selectedTemplateUrl.length; i++) {
        const templateUrl = processedData.selectedTemplateUrl[i];

        // Skip if already base64 data
        if (templateUrl.startsWith('data:') || this.isBase64(templateUrl)) {
          continue;
        }

        // Extract filename from URL
        const filename = this.extractFilenameFromUrl(templateUrl);

        // Load template image from public directory
        try {
          const templatePath = path.join(process.cwd(), 'public', 'adsTemplates', filename);
          this.logger.log(`Loading template from path: ${templatePath}`);

          // Read file and convert to base64
          const imageBuffer = fs.readFileSync(templatePath);
          const base64Image = imageBuffer.toString('base64');

          // Replace URL with base64 data
          processedData.selectedTemplateUrl[i] = base64Image;
        } catch (error) {
          this.logger.error(`Failed to load template image: ${filename}`, error);
          throw new BadRequestException(`Template image not found: ${filename}`);
        }
      }
    }

    return processedData;
  }

  /**
   * Extract filename from URL
   */
  private extractFilenameFromUrl(url: string): string {
    if (url.includes('/')) {
      return url.split('/').pop() || url;
    }
    return url;
  }

  /**
   * Check if a string is already base64
   */
  private isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  /**
   * Clean base64 data by removing data URL prefix if present
   */
  private cleanBase64Data(base64String: string): string {
    if (!base64String) return '';

    // Extract base64 part from data URL
    if (base64String.startsWith('data:')) {
      const parts = base64String.split(',');
      if (parts.length === 2) {
        return parts[1];
      }
    }

    return base64String;
  }
}
