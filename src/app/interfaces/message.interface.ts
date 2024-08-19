import { OrthographyResponse } from "./orthography.response";

export interface Message{
    text:string;
    isGpt: boolean;
    info ?: OrthographyResponse
}
