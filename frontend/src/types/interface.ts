export interface IadCreatorData {
  uploadedImages: string[];
  selectedTemplateUrl: string[];
  settings?: {
    creativityLevel?: number;
    detailLevel?: number;
    imageSize?: string;
  };
}