export interface CaptionResponse {
  reasoning: string;
  englishCaption: string;
  chineseCaption: string;
}

export interface MediaFile {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
  base64: string;
  mimeType: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}