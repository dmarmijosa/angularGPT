import { Injectable } from '@angular/core';
import {
  audioToTextUseCase,
  imageGenerationuseCase,
  orthographyUseCase,
  prosConsStreamUseCase,
  prosConsUseCase,
  textToAudioUseCase,
  translateUseCase,
} from '@use-cases/index';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  checkOrthography(prompt: string) {
    return from(orthographyUseCase(prompt));
  }

  prosConsDiscusser(prompt: string) {
    return from(prosConsUseCase(prompt));
  }
  prosConsStreamDiscusser(prompt: string, abortSignal: AbortSignal) {
    return prosConsStreamUseCase(prompt, abortSignal);
  }

  translate(prompt: string, lang: string) {
    return from(translateUseCase(prompt, lang));
  }

  textToAudio(prompt: string, voice: string) {
    return from(textToAudioUseCase(prompt, voice));
  }
  
  audioToText(file: File, prompt?: string) {
    return from(audioToTextUseCase(file,prompt));
  }

  imageGeneration(prompt: string, originalImage?:string, maskImage?:string ){
    return from(imageGenerationuseCase(prompt,originalImage, maskImage))
  }
  
}
