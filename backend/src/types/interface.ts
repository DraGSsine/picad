export interface IUser {
  email: string;
  name: string;
  googleId?: string;
  picture?: string;
  authProvider: string;
}

export interface IadCreatorData {
  uploadedImages: string[];
  selectedTemplateUrl: string[];
  settings?: {
    creativityLevel?: number;
    detailLevel?: number;
    targetPlatform?: string;
    aspectRatio?: string;
  };
}