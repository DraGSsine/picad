import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
import OpenAI from 'openai';
import { IadCreatorData } from 'src/types/interface';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openRouterApiKey: string;
  private readonly geminiApiKey: string;
  private readonly ai: any;

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.geminiApiKey = this.configService.get('GEMINI_API_KEY')!;
    this.openRouterApiKey = this.configService.get<string>('OPENROUTER_API_KEY')!;

    // Initialize the AI service
    this.ai = new GoogleGenAI({ apiKey: this.geminiApiKey });
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
      this.logger.log(`Processing ad generation with prompt: ${prompt?.substring(0, 50)}...`);

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
      const imageData = await this.generateImage(
        editPrompt, 
        adCreatorData, 
        cleanCurrentImage // Pass current image for editing
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
   * Centralized function for generating images (both new and edits)
   * @param prompt The design/edit prompt to use
   * @param adCreatorData Settings data
   * @param currentImage Optional current image for editing
   */
  private async generateImage(
    prompt: string,
    adCreatorData: IadCreatorData,
    currentImage?: string
  ): Promise<string> {
    try {
      const isEditOperation = !!currentImage;
      
      // Create appropriate content for generation or editing
      let content = '';
      let images: { inlineData: { data: string; mimeType: string } }[] = [];
      
      if (isEditOperation) {
        // Content for editing an existing image
        content = `Edit this advertisement according to these instructions: ${prompt}
        
        Aspect ratio: ${adCreatorData.settings?.aspectRatio || '3:2'}
        Platform: ${adCreatorData.settings?.targetPlatform || 'Instagram'}
        
        Keep the same overall style and composition, but make the specific changes requested.`;
        
        // Add the current image to be edited
        images.push({
          inlineData: {
            data: currentImage,
            mimeType: 'image/jpeg'
          }
        });
      } else {
        // Content for generating a new image
        content = `Create an advertisement combining the product image with the template style, following this design direction: ${prompt}
        
        Aspect ratio: ${adCreatorData.settings?.aspectRatio || '9:16'}
        Platform: ${adCreatorData.settings?.targetPlatform || 'Instagram'}
        
        Generate a high-quality, professional advertisement.`;
        
        // Add product and template images for new generation
        const productImage = this.cleanBase64Data(adCreatorData.uploadedImages[0]);
        const templateImage = this.cleanBase64Data(adCreatorData.selectedTemplateUrl[0]);
        
        images.push({
          inlineData: {
            data: productImage,
            mimeType: 'image/jpeg'
          }
        });
        
        images.push({
          inlineData: {
            data: templateImage,
            mimeType: 'image/jpeg'
          }
        });
      }

      // Call Gemini API with appropriate content and images
      const modelContents = [{
        role: 'user',
        parts: [
          { text: content },
          ...images
        ]
      }];

      // Call the Gemini 2.0 Flash image generation API
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-exp-image-generation',
        contents: modelContents,
        config: {
          responseModalities: ['Text', 'Image'],
        },
      });

      // Extract image and text data
      const { imageData, textResponse } = this.extractImageFromResponse(response);

      if (!imageData) {
        throw new Error(`No ${isEditOperation ? 'edited ' : ''}image was generated`);
      }

      // Log the text response
      this.logger.log(`Generated ${isEditOperation ? 'edited ' : ''}image with text: ${textResponse?.substring(0, 50)}...`);

      return imageData;
    } catch (error) {
      this.logger.error(`Error in image ${currentImage ? 'editing' : 'generation'}`, error);
      throw new Error(`Failed to ${currentImage ? 'edit' : 'generate'} image: ${error.message || 'Unknown error'}`);
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
      const promptText = `Generate a clear, concise design prompt for incorporating the product into the template style.

      The prompt should be medium length (100-150 words) focusing on:
      - Key visual elements to include
      - Color palette alignment 
      - Product placement
      - Overall composition

      Design parameters:
      - Creativity: ${adCreatorData.settings?.creativityLevel || 50}%
      - Detail: ${adCreatorData.settings?.detailLevel || 50}%
      - Platform: ${adCreatorData.settings?.targetPlatform || 'Instagram'}
      - Aspect ratio: ${adCreatorData.settings?.aspectRatio || '9:16'}
      
      Additional guidance: ${prompt || 'Create a professional advertisement'}
      
      Keep the prompt actionable and focused - it will be used directly for generating the final image.`;

      // Call OpenRouter API with Gemini model
      const messages = [
        {
          role: 'system',
          content: 'You are a precise and detail-oriented assistant that generates optimized design prompts for advertisements.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${uploadedImage}` },
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${templateImage}` },
            },
          ],
        },
      ];

      const response = await this.callOpenRouter(messages);
      console.log("---------->",response.data);
      const designPrompt = response.data.choices[0].message.content.trim();
      
      this.logger.log(`Generated design prompt: ${designPrompt.substring(0, 50)}...`);
      return designPrompt;
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
      const promptText = `Generate a clear, precise edit instruction for modifying the existing advertisement.

      The instruction should focus on:
      - Specific changes requested in the user prompt
      - Maintaining the overall composition and style
      - Only modifying elements that need to change
      - Preserving the product placement and branding

      Edit parameters:
      - Target platform: ${adCreatorData.settings?.targetPlatform || 'Instagram'}
      - Aspect ratio: ${adCreatorData.settings?.aspectRatio || '3:2'}
      
      User's edit request: ${prompt || 'Improve the ad'}
      
      Keep the edit instruction actionable and focused on what needs to change in the existing image.`;

      // Call OpenRouter API with Gemini model
      const messages = [
        {
          role: 'system',
          content: 'You are a precise and detail-oriented assistant that generates optimized edit instructions for advertisements.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${currentImage}` },
            },
          ],
        },
      ];

      const response = await this.callOpenRouter(messages);
      
      if (response.data?.choices?.[0]?.message?.content) {
        const editPrompt = response.data.choices[0].message.content.trim();
        this.logger.log(`Generated edit prompt: ${editPrompt.substring(0, 50)}...`);
        return editPrompt;
      }

      // Fallback if response format is unexpected
      this.logger.warn('Unexpected API response structure. Using fallback edit prompt.');
      return `Edit the advertisement according to these instructions: ${prompt}`;
    } catch (error) {
      this.logger.error('Error generating edit prompt', error);
      return `Edit the advertisement according to these instructions: ${prompt}`;
    }
  }

  /**
   * Centralized function for calling OpenRouter API
   */
  private async callOpenRouter(messages: any[]): Promise<any> {
    return axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model:"google/gemini-2.0-flash-exp:free",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://picad.pro',
          'X-Title': 'Ad Creator',
        },
      },
    );
  }

  /**
   * Extract image data from Gemini API response
   */
  private extractImageFromResponse(response: any): { imageData: string; textResponse: string } {
    let imageData = '';
    let textResponse = '';

    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          textResponse = part.text;
        } else if (part.inlineData) {
          imageData = part.inlineData.data || '';
        }
      }
    }

    return { imageData, textResponse };
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
