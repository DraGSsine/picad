// ai/dto/edit.dto.ts
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { IadCreatorData } from 'src/types/interface';

export class EditDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsObject()
  @IsOptional()
  adCreatorData: IadCreatorData;

  @IsString()
  @IsNotEmpty()
  currentImage: string;
}