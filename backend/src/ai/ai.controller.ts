// ai/ai.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { SubscriptionGuard } from 'src/guards/subscription.guard';
import { GenerateDto } from './dto/generate.dto';
import { EditDto } from './dto/edit.dto';

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
  async editContent(
    @Req() req,
    @Body() editDto: EditDto,
  ): Promise<any> {
    const { prompt, adCreatorData, currentImage } = editDto;
    return await this.aiService.edit(prompt, adCreatorData, currentImage, req.user.email);
  }
}
