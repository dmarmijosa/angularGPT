import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TextMessageBoxFileComponent,
  TextMessageInterface,
  TypingLoaderComponent,
} from '@components/index';
import { AudioToTextResponse } from '@interfaces/audio-text.response';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    ReactiveFormsModule,
    TextMessageBoxFileComponent,
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  openAiService = inject(OpenAiService);

  handleMessageWithFile({ prompt, file }: TextMessageInterface) {
    const text = prompt ?? file.name ?? 'Traduce el audio';
    this.isLoading.set(true);

    this.messages.update((prev) => [...prev, { text: text, isGpt: false }]);

    this.openAiService
      .audioToText(file, text)
      .subscribe((resp) => this.handleResponse(resp));
  }
  handleResponse(resp: AudioToTextResponse | null) {
    this.isLoading.set(false);
    if (!resp) return;

    const text = `## Transcripción: 
    __Duración:___ ${Math.round(resp.duration)} segundos.
    ## El texto es:
    ${resp.text}`;

    this.messages.update((prev) => [...prev, { isGpt: true, text }]);

    for(const segment of resp.segments){
      const segmentMessage = `
      __De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos.__
      ${segment.text}`;

      this.messages.update(prev => [...prev, {isGpt: true, text: segmentMessage}])
    }
  }
}
