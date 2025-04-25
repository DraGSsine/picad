// ai/ai.controller.ts
import { Controller, Post, Body, Req, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { SubscriptionGuard } from 'src/guards/subscription.guard';
import { GenerateDto } from './dto/generate.dto';
import { IadCreatorData } from 'src/types/interface';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  async generateContent(
    @Req() req,
    @Body() generateDto: GenerateDto,
  ): Promise<any> {
    const { prompt, adCreatorData } = generateDto;
    return await this.aiService.generate(prompt, adCreatorData, req.user.email);
  }

  @Post('edit')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  async edit(
    @Body()
    {
      prompt,
      adCreatorData,
      currentImage,
      canvasEditData, // Added new parameter for canvas edits
    }: {
      prompt: string;
      adCreatorData: IadCreatorData;
      currentImage: string;
      canvasEditData?: string;
    },
    @Request() req: any,
  ): Promise<{ imageData: string; imageSize: string }> {
    const userEmail = req.user.email;
    return this.aiService.edit(
      prompt,
      adCreatorData,
      currentImage,
      userEmail,
      canvasEditData, // Pass canvas edit data to service
    );
  }
}
