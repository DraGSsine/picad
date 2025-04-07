export interface HistoryItem {
  id: string;
  imageUrl: string | null;
  prompt: string;
  timestamp: Date;
  step?: string;
} 