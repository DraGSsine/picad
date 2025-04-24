// ai/dto/generate-content.dto.ts
import { IsString, IsNumber, IsArray, ValidateNested, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class SettingsDto {
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  creativityLevel: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  detailLevel: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  tongueLevel: number;

  @IsString()
  @IsEnum(['Instagram', 'Facebook', 'TikTok', 'General'])
  targetPlatform: string;

  @IsString()
  @IsEnum(['1:1', '4:5', '9:16', '16:9'])
  aspectRatio: string;
}

// Updated to match the simplified structure with string arrays
export class adCreatorDataDto {
  @IsArray()
  @IsString({ each: true })
  uploadedImages: string[]; // Array of base64 strings

  @IsArray()
  @IsString({ each: true })
  selectedTemplateUrl: string[]; // Array of template URLs

  @ValidateNested()
  @Type(() => SettingsDto)
  settings: SettingsDto;
}

export class GenerateDto {
  @ValidateNested()
  @Type(() => adCreatorDataDto)
  adCreatorData: adCreatorDataDto;

  @IsString()
  prompt: string;
}
