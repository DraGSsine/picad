export interface HistoryItem {
  id: string;
  imageUrl: string | null;
  prompt: string;
  timestamp: Date;
  step?: string;
  imageSize?: string; // Updated to store the image size instead of aspect ratio
}