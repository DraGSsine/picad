import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
import OpenAI, { toFile } from 'openai';
import { IadCreatorData } from 'src/types/interface';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

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

  async generate(
    prompt: string,
    adCreatorData: IadCreatorData,
    userEmail: string,
  ): Promise<{ imageData: string; imageSize: string }> {
    try {
      const generatedPrompt = await this.generatePrompt(prompt, adCreatorData);
      console.log(generatedPrompt);
      const result = await this.generateImage(generatedPrompt, adCreatorData);
      return {
        imageData: result,
        imageSize: adCreatorData.settings?.imageSize || '1024x1024',
      };
    } catch (error) {
      throw new BadRequestException(`Error generating image ${error.message}`);
    }
  }

  async edit(
    prompt: string,
    adCreatorData: IadCreatorData,
    currentImage: string,
    userEmail: string,
  ): Promise<{ imageData: string; imageSize: string }> {
    try {
      // Generate a new prompt for editing
      const generatedPrompt = await this.generateEditPrompt(
        prompt,
        currentImage,
      );

      // Process the current image - remove data URI prefix if present
      let imageData = currentImage;
      if (currentImage.startsWith('data:image')) {
        imageData = currentImage.split(',')[1]; // Extract base64 data without the prefix
      }

      // Convert the base64 image to a file for the OpenAI API
      const buffer = Buffer.from(imageData, 'base64');
      const imageFile = await toFile(buffer, 'current-image.png', {
        type: 'image/png',
      });

      // Set up images array with the current image first
      const images: any = [imageFile];

      // Add any additional images needed for editing
      // Process uploaded images if any
      for (const uploadedImage of adCreatorData.uploadedImages) {
        // For URLs, fetch them first
        const response = await axios.get(uploadedImage, {
          responseType: 'arraybuffer',
        });
        const imageBuffer = Buffer.from(response.data);
        const file = await toFile(imageBuffer, 'additional-image.png', {
          type: 'image/png',
        });
        images.push(file);
      }

      // Process template images from selectedTemplateUrl
      for (const templateUrl of adCreatorData.selectedTemplateUrl) {
        if (templateUrl.startsWith('http')) {
          const imageName = templateUrl.split('/').pop();
          const imagePath = path.join(process.cwd(), 'public', 'adsTemplates', imageName!);

          if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');
            const buffer = Buffer.from(base64Image, 'base64');
            const file = await toFile(buffer, imageName!, { type: 'image/png' });
            images.push(file);
          } else {
            throw new BadRequestException(`Image not found: ${imagePath}`);
          }
        } else {
          // Handle base64 template directly
          let base64Content = templateUrl;
          if (base64Content.includes(',')) {
            base64Content = base64Content.split(',')[1];
          }
          const buffer = Buffer.from(base64Content, 'base64');
          const file = await toFile(buffer, 'template.png', { type: 'image/png' });
          images.push(file);
        }
      }

      // Call OpenAI API for image editing
      const size = adCreatorData.settings?.imageSize || '1024x1024';
      const response = await this.openai.images.edit({
        model: 'gpt-image-1',
        image: images,
        prompt: generatedPrompt,
        size: size,
        quality: 'high',
      });

      // Return the image data directly
      if (response.data[0].b64_json) {
        // Return the base64 image data with proper data URI prefix
        console.log("Keeeep this one");
        return {
          imageData: response.data[0].b64_json,
          imageSize: size,
        };
      } else if (response.data[0].url) {
        return {
          imageData: response.data[0].url,
          imageSize: size,
        };
      } else {
        throw new Error('No image data returned from API');
      }
    } catch (error) {
      this.logger.error(`Error in edit: ${error.message}`);
      throw new BadRequestException(`Error editing image: ${error.message}`);
    }
  }

  /// helper functions

  async generatePrompt(
    prompt: string,
    adCreatorData: IadCreatorData,
  ): Promise<string> {
    try {
      // Create an array to hold messages with all uploaded images
      const creativityLevel = adCreatorData.settings?.creativityLevel ?? 50;
      const detailLevel = adCreatorData.settings?.detailLevel ?? 50;
      const promptText = `
      
Generate a detailed, actionable prompt for an AI image editor based on the user's prompt, provided images, and control parameters.

**User's Original Request:** "${prompt}"

**Control Parameters:**
- Creativity Level: ${creativityLevel}% (0=minimal changes to template, 100=explore new creative ideas)
- Detail Level: ${detailLevel}% (0=basic clean rendering, 100=high detail with textures, fine grain elements, etc.)

**Inputs Analysis:**
1. **Product Image(s):** The first image(s) provided contain the user's product. These must remain unaltered.
2. **Ad Template Image:** The last image provided is the ad layout/template where product(s) should be inserted.

**Core Objective:**
Replace template placeholders with the user's product(s) while addressing the user's specific request: "${prompt}"

**Integration Instructions:**
1. Place the user's product(s) in the template with ZERO ALTERATIONS to the product itself.
2. Adapt the template's visual elements based on Creativity Level (${creativityLevel}%):
   - Low creativity: Minimal changes to template's design
   - High creativity: Transform colors/mood to create a cohesive design inspired by the product

**Realism Instructions:**
- If humans appear in the ad, render them with photorealistic detail and natural expressions
- All people should have realistic skin texture, natural proportions, and appropriate lighting
- All text should be perfectly legible and contextually relevant
- Shadows, reflections, and lighting must be physically accurate

**Detail Implementation (${detailLevel}%):**
- Low detail: Clean, simple rendering with basic lighting
- High detail: Include fine textures, subtle shadows, material properties, micro-details, and environmental effects
- At maximum detail: Add appropriate surface imperfections, grain textures, and high-resolution elements

**Final Output Requirements:**
- Honor the user's original request ("${prompt}") as the primary directive
- Maintain the composition structure of the original template
- Ensure all text is grammatically correct and professionally written
- Generate an advertisement that looks professionally designed and ready for publication
      `;

      const messages: any = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: promptText.trim(),
            },
          ],
        },
      ];

      // Loop through uploaded images and add them to the content
      for (const uploadedImage of adCreatorData.uploadedImages) {
        messages[0].content.push({
          type: 'image_url',
          image_url: {
            url: uploadedImage,
          },
        });
      }

      // Add the template image - it's already base64 from the frontend
      try {
        for (const templateUrl of adCreatorData.selectedTemplateUrl) {
          if (templateUrl.startsWith('http')) {
            const imageName = templateUrl.split('/').pop();
            const imagePath = path.join(process.cwd(), 'public', 'adsTemplates', imageName!);

            if (fs.existsSync(imagePath)) {
              const imageBuffer = fs.readFileSync(imagePath);
              const base64Image = imageBuffer.toString('base64');
              messages[0].content.push({
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                },
              });
            } else {
              throw new BadRequestException(`Image not found: ${imagePath}`);
            }
          } else {
            const templateBase64 = templateUrl;
            messages[0].content.push({
              type: 'image_url',
              image_url: {
                url: templateBase64, // Already in base64 format from frontend
              },
            });
          }
        }
      } catch (err) {
        this.logger.error(`Failed to process template image: ${err.message}`);
        throw new BadRequestException(
          `Template image processing failed: ${err.message}`,
        );
      }

      // Make the API request using axios
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'google/gemini-2.0-flash-exp:free',
          messages: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('OPENROUTER_API_KEY')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error(`Error in generatePrompt: ${error.message}`);
      throw new BadRequestException(
        `Error generating prompt: ${error.message}`,
      );
    }
  }

  async generateEditPrompt(
    prompt: string,
    currentImage: string,
  ): Promise<string> {
    try {
      const promptText = `
        Given the following user prompt: "${prompt}", and the attached image which contains user edits (such as brush strokes or added text), generate a detailed, concise prompt for an AI image editor to apply these changes and create a visually appealing advertisement.
        Instructions:
        - Carefully analyze the user edits in the image, including any brush marks or added text.
        - Describe exactly how these edits should be incorporated into the final ad design, specifying placement, style, color, and integration with the existing image.
        - Ensure the final prompt clearly communicates all necessary details for the AI to reproduce the user's intended modifications in a professional, ad-ready format.
        - Do not remove or ignore any user edits; all changes in the image must be reflected in the generated prompt.
        - Most importantly, absolutely nothing in the image should be changed except for the exact areas where the user edits are present. All other parts of the image must remain completely untouched and unaltered. Do not modify, recolor, or alter any text, font, or design elements outside the edited regions. The AI must strictly limit changes to only the user-edited areas and preserve everything else exactly as in the original image.
      `;
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: promptText.trim(),
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: currentImage,
                  },
                },
              ],
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('OPENROUTER_API_KEY')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error(`Error in generateEditPrompt: ${error.message}`);
      throw new BadRequestException(
        `Error generating edit prompt: ${error.message}`,
      );
    }
  }

  async generateImage(
    prompt: string,
    adCreatorData: IadCreatorData,
  ): Promise<string> {
    try {
      // Process uploaded images and template using toFile
      const images: any = [];
      const size = adCreatorData.settings?.imageSize || '1024x1024';

      // Process uploaded images
      for (const uploadedImage of adCreatorData.uploadedImages) {
        // For URLs, fetch them first
        const response = await axios.get(uploadedImage, {
          responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data);
        const file = await toFile(buffer, 'product-image.png', {
          type: 'image/png',
        });
        images.push(file);
      }

      // Process template images from selectedTemplateUrl
      for (const templateUrl of adCreatorData.selectedTemplateUrl) {
        if (templateUrl.startsWith('http')) {
          const imageName = templateUrl.split('/').pop();
          const imagePath = path.join(process.cwd(), 'public', 'adsTemplates', imageName!);

          if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');
            const buffer = Buffer.from(base64Image, 'base64');
            const file = await toFile(buffer, imageName!, { type: 'image/png' });
            images.push(file);
          } else {
            throw new BadRequestException(`Image not found: ${imagePath}`);
          }
        } else {
          // Handle base64 template directly
          let base64Content = templateUrl;
          if (base64Content.includes(',')) {
            base64Content = base64Content.split(',')[1];
          }
          const buffer = Buffer.from(base64Content, 'base64');
          const file = await toFile(buffer, 'template.png', { type: 'image/png' });
          images.push(file);
        }
      }

      // Call OpenAI API for image editing
      const response = await this.openai.images.edit({
        model: 'gpt-image-1',
        image: images,
        prompt: prompt,
        size: size,
        quality: "high",
      });

      return response.data[0].b64_json;
    } catch (error) {
      this.logger.error(`Error in generateImage: ${error.message}`);
      throw new BadRequestException(`Error generating image: ${error.message}`);
    }
  }
}
