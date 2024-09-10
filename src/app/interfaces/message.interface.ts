import { OrthographyResponse } from './orthography.response';

export interface Message {
  text: string;
  isGpt: boolean;
  info?: OrthographyResponse;
  audioUrl?: string;
  imageInfo?:imageInfo;
}
interface imageInfo {
  url: string;
  alt: string;
}
