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

      // Process template image if present
      if (
        adCreatorData.selectedTemplateUrl &&
        adCreatorData.selectedTemplateUrl.length > 0
      ) {
        const templatePath = path.join(
          process.cwd(),
          'public',
          'adsTemplates',
          adCreatorData.selectedTemplateUrl[0].split('/').pop()!,
        );
        const templateFile = await toFile(
          fs.createReadStream(templatePath),
          'template.jpg',
          {
            type: 'image/jpeg',
          },
        );
        images.push(templateFile);
      }

      // Call OpenAI API for image editing
      const size = adCreatorData.settings?.imageSize || '1024x1024';
      const response = await this.openai.images.edit({
        model: 'gpt-image-1',
        image: images,
        prompt: generatedPrompt,
        size: size,
        quality: 'low',
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
      const creativity = adCreatorData.settings?.creativityLevel ?? 50;
      const detail = adCreatorData.settings?.detailLevel ?? 50;
      const promptText = `
        Given the following user prompt: "${prompt}", product images (provided first), and an ad template image (provided last), generate a single, concise prompt for an AI image editor to seamlessly insert the main product(s) into the template.
        - Creativity: ${creativity}%
        - Detail: ${detail}%
        Instructions:
        - Carefully analyze both the product image(s) and the template image. Describe all relevant visual details, such as lighting, perspective, shadows, colors, background, and any text or branding present.
        - Ensure the product(s) are integrated in a way that matches the template's style and context.
        - Do NOT alter, modify, or obscure any original features of the product(s), including but not limited to: logos, symbols, text, font, size, proportions, or distinctive markings. The product(s) must remain exactly as shown.
        - Adjust only the background and template elements as needed to fit the product(s) naturally.
        - Provide clear, direct instructions for realistic, visually appealing integration, mentioning all key aspects of how the final image should look.
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

      // Get the template image and convert to base64
      try {
        // The template URL is on the server, get the full path
        const templatePath = path.join(
          process.cwd(),
          'public',
          'adsTemplates',
          adCreatorData.selectedTemplateUrl[0].split('/').pop()!,
        );
        const templateBase64 = fs.readFileSync(templatePath).toString('base64');

        messages[0].content.push({
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${templateBase64}`,
          },
        });
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

      // Process template image
      const templatePath = path.join(
        process.cwd(),
        'public',
        'adsTemplates',
        adCreatorData.selectedTemplateUrl[0].split('/').pop()!,
      );
      const templateFile = await toFile(
        fs.createReadStream(templatePath),
        'template.jpg',
        {
          type: 'image/jpeg',
        },
      );
      images.push(templateFile);

      // Call OpenAI API for image editing
      const response = await this.openai.images.edit({
        model: 'gpt-image-1',
        image: images,
        prompt: prompt,
        size: size,
        quality: 'low',
      });

      return response.data[0].b64_json;
    } catch (error) {
      this.logger.error(`Error in generateImage: ${error.message}`);
      throw new BadRequestException(`Error generating image: ${error.message}`);
    }
  }
}
