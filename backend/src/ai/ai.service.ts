import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
import OpenAI from 'openai';
import { IadCreatorData } from 'src/types/interface';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private readonly logger = new Logger(AiService.name);
  private promptGenerationModel: any;
  private geminiApiKey: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.geminiApiKey = this.configService.get('GEMINI_API_KEY')!;
    // Get the model using the correct method
    this.promptGenerationModel = new GoogleGenerativeAI(this.geminiApiKey);
  }

  // MAIN ENTRY POINT: Combined function that orchestrates the entire process
  async generate(
    prompt: string,
    adCreatorData: IadCreatorData,
    userEmail: string,
  ): Promise<{ imageData: string; promptText: string }> { // Updated return type
    try {
      this.logger.log('Processing complete ad generation request with prompt: ' + prompt?.substring(0, 50));
      
      // Validate required data exists
      if (!adCreatorData || !adCreatorData.uploadedImages || !adCreatorData.uploadedImages.length) {
        throw new BadRequestException('No product images provided');
      }

      if (!adCreatorData.selectedTemplateUrl || !adCreatorData.selectedTemplateUrl.length) {
        throw new BadRequestException('No template selected');
      }

      // Process template images - convert URLs to base64 if needed
      adCreatorData = await this.preprocessAdData(adCreatorData);
      
      // STEP 1: Generate the design prompt
      const designPrompt = await this._generateDesignPrompt(prompt, adCreatorData);
      
      // STEP 2: Generate the image using the created design prompt
      const imageData = await this._generateImageFromPrompt(designPrompt, adCreatorData);
      
      // Return only the image data and prompt text
      return {
        imageData,
        promptText: designPrompt
      };
    } catch (error) {
      this.logger.error('Error in complete ad generation process', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to generate advertisement: ' + (error.message || 'Unknown error'));
    }
  }

  // HELPER FUNCTION 1: Generate design prompt
  private async _generateDesignPrompt(
    prompt: string,
    adCreatorData: IadCreatorData,
  ): Promise<string> {
    // Get image data and ensure proper base64 formatting
    const uploadedImage = this.cleanBase64Data(adCreatorData.uploadedImages[0]);
    const templateImage = this.cleanBase64Data(adCreatorData.selectedTemplateUrl[0]);
    
    // Create prompt text for design generation
    const prompt_text = `Generate a clear, concise design prompt for incorporating the product into the template style.

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
    
    Additional guidance: ${prompt || "Create a professional advertisement"}
    
    Keep the prompt actionable and focused - it will be used directly for generating the final image.`;

    // Call the Gemini API to generate the prompt
    const model = this.promptGenerationModel.getGenerativeModel({ model: "gemini-1.5-pro" });
    const promptResult = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt_text },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: uploadedImage
              }
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: templateImage
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    // Extract and return the generated prompt text
    const designPrompt = promptResult.response ? promptResult.response.text() : 'Create a professional advertisement featuring the product in the template style';
    this.logger.log('Generated design prompt: ' + designPrompt.substring(0, 50) + '...');
    return designPrompt;
  }

  // HELPER FUNCTION 2: Generate image from prompt
  private async _generateImageFromPrompt(
    designPrompt: string,
    adCreatorData: IadCreatorData,
  ): Promise<string> { // Changed return type to just string
    // Get image data
    const productImage = this.cleanBase64Data(adCreatorData.uploadedImages[0]);
    const templateImage = this.cleanBase64Data(adCreatorData.selectedTemplateUrl[0]);

    try {
      // Create content with text prompt and images
      const content = `Create an advertisement combining the product image with the template style, following this design direction: ${designPrompt}
      
      Aspect ratio: ${adCreatorData.settings?.aspectRatio || '9:16'}
      Platform: ${adCreatorData.settings?.targetPlatform || 'Instagram'}
      
      Generate a high-quality, professional advertisement.`;

      // Initialize the Gemini client with API key from config
      const ai = new GoogleGenAI({ apiKey: this.geminiApiKey });

      // Call the Gemini 2.0 Flash image generation API
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: [
          {
            role: "user",
            parts: [
              { text: content },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: productImage
                }
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: templateImage
                }
              }
            ]
          }
        ],
        config: {
          responseModalities: ["Text", "Image"],
        }
      });

      let imageData = '';
      let textResponse = ''; // Still capturing for logging purposes

      // Process response to extract image and text
      if (response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content?.parts || [];
        for (const part of parts) {
          if (part.text) {
            textResponse = part.text; // Capture for logging
          } else if (part.inlineData) {
            imageData = part.inlineData.data || '';
          }
        }
      }

      if (!imageData) {
        throw new Error('No image was generated');
      }

      // Log the text response but don't return it
      this.logger.log('Generated image with text response: ' + textResponse.substring(0, 50) + '...');
      
      // Only return the image data
      return imageData;
    } catch (error) {
      this.logger.error('Error in image generation', error);
      throw new Error('Failed to generate image: ' + (error.message || 'Unknown error'));
    }
  }

  // New helper method to preprocess ad data and load template images
  private async preprocessAdData(adCreatorData: IadCreatorData): Promise<IadCreatorData> {
    // Create a copy of the data to avoid modifying the original
    const processedData = { ...adCreatorData };
    
    // Process template URLs - convert filenames or URLs to base64 if needed
    if (processedData.selectedTemplateUrl && processedData.selectedTemplateUrl.length) {
      for (let i = 0; i < processedData.selectedTemplateUrl.length; i++) {
        const templateUrl = processedData.selectedTemplateUrl[i];
        
        // Check if it's already base64 data
        if (templateUrl.startsWith('data:') || this.isBase64(templateUrl)) {
          continue; // Already in the correct format
        }
        
        // Extract filename from URL or use the string as filename
        const filename = this.extractFilenameFromUrl(templateUrl);
        
        // Load the template image from the public directory
        try {
          const templatePath = path.join(process.cwd(), 'public', 'adsTemplates', filename);
          this.logger.log(`Loading template from path: ${templatePath}`);
          
          // Read the file and convert to base64
          const imageBuffer = fs.readFileSync(templatePath);
          const base64Image = imageBuffer.toString('base64');
          
          // Replace the URL with the base64 data
          processedData.selectedTemplateUrl[i] = base64Image;
        } catch (error) {
          this.logger.error(`Failed to load template image: ${filename}`, error);
          throw new BadRequestException(`Template image not found: ${filename}`);
        }
      }
    }
    
    return processedData;
  }
  
  // Helper to extract filename from URL
  private extractFilenameFromUrl(url: string): string {
    if (url.includes('/')) {
      return url.split('/').pop() || url;
    }
    return url;
  }
  
  // Helper to check if a string is already base64
  private isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  // Helper method to clean base64 data
  private cleanBase64Data(base64String: string): string {
    if (!base64String) return '';
    
    // Check if it's a data URL and extract just the base64 part
    if (base64String.startsWith('data:')) {
      const parts = base64String.split(',');
      if (parts.length === 2) {
        return parts[1];
      }
    }
    
    return base64String;
  }
}
