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
  TypingLoaderComponent,
  TextMessageBoxComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    ReactiveFormsModule,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsPageComponent {
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    this.isLoading.set(true);
    this.messages.update((prev) => [
      ...prev,
      {
        isGpt: false,
        text: prompt,
      },
    ]);
    this.openAiService.prosConsDiscusser(prompt).subscribe({
      next: (resp) => {
        this.messages.update((prev) => [
          ...prev,
          {
            isGpt: true,
            text: resp.content,
          },
        ]);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
