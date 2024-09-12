import { OrthographyResponse } from './orthography.response';

export interface Message {
  text: string;
  isGpt: boolean;
  info?: OrthographyResponse;
  audioUrl?: string;
  imageInfo?:imagenInfo;
}
export interface imagenInfo {
  url: string;
  alt: string;
}
