export interface HistoryItem {
  id: string;
  imageUrl: string | null;
  prompt: string;
  timestamp: Date;
  step?: string;
  aspectRatio?: string; // Add support for storing the aspect ratio
}