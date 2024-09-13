import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TextMessageBoxComponent,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-assistant-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    ReactiveFormsModule,
    TextMessageBoxComponent,
  ],
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  openAiService = inject(OpenAiService);
  threadId = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.openAiService.createThread().subscribe((id) => {
      this.threadId.set(id);
    });
    if (localStorage.getItem('messagesAi')) {
      this.messages.set(JSON.parse(localStorage.getItem('messagesAi')!));
    }
  }
  handleMessage(question: string) {
    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { text: question, isGpt: false }]);
    this.openAiService.postQuestion(this.threadId()!, question).subscribe({
      next: (replies) => {
        for (const replay of replies) {
          if (replay.role === 'assistant') {
            for (const messages of replay.content) {
              this.messages.update((prev) => [
                ...prev,
                {
                  text: messages,
                  isGpt: replay.role === 'assistant' ? true : false,
                },
              ]);
              this.removeDuplicates();
            }
          }
        }
        localStorage.setItem('messagesAi', JSON.stringify(this.messages()));

        console.log(this.messages());
      },
      complete: () => this.isLoading.set(false),
    });
  }
  removeDuplicates() {
    this.messages.update((prev) => {
      // Utilizamos un Map para asegurarnos de que solo queden mensajes únicos
      const uniqueMessages = new Map<string, Message>();

      // Filtramos los duplicados, donde 'text' es la clave que queremos usar para evitar duplicados
      prev.forEach((message) => {
        uniqueMessages.set(message.text, message);
      });

      // Retornamos solo los valores únicos
      return Array.from(uniqueMessages.values());
    });
  }
  clearMessage() {
    this.messages.set([]);
    localStorage.clear();
  }
}
