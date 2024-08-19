import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ChatMessageComponent,
  GptMessageOrthographyComponent,
  MyMessageComponent,
  TextMessageBoxComponent,
  TextMessageBoxEvent,
  TextMessageBoxSelectComponent,
  TextMessageInterface,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/index';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-orthography-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    GptMessageOrthographyComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent implements AfterViewChecked, AfterViewInit {
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  openAiService = inject(OpenAiService);
  @ViewChild('chatMessagesContainer')
  private chatMessagesContainer!: ElementRef;
  private mutationObserver!: MutationObserver;
  private wasAtBottom = true;

  handleMessage(prompt: string) {
    this.isLoading.set(true);
    this.messages.update((prev) => [
      ...prev,
      {
        isGpt: false,
        text: prompt,
      },
    ]);

    this.openAiService.checkOrthography(prompt).subscribe({
      next: (resp) => {
        this.messages.update((prev) => [
          ...prev,
          {
            isGpt: true,
            text: resp.message,
            info: resp,
          },
        ]);
      },
      complete: () => this.isLoading.set(false),
    });
  }
  ngAfterViewInit(): void {
    const container = this.chatMessagesContainer.nativeElement;

    // Configurar un MutationObserver para observar cambios en el contenedor
    this.mutationObserver = new MutationObserver(() => {
      if (this.wasAtBottom) {
        this.scrollToBottom();
      }
    });

    this.mutationObserver.observe(container, {
      childList: true, // Observar cuando se agregan o eliminan elementos
    });

    container.addEventListener('scroll', () => {
      // Comprobar si el usuario está en la parte inferior
      const { scrollTop, scrollHeight, clientHeight } = container;
      this.wasAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    });
  }

  ngAfterViewChecked(): void {
    if (this.wasAtBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    const container = this.chatMessagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  ngOnDestroy(): void {
    // Desconectar el observer cuando el componente se destruye
    this.mutationObserver.disconnect();
  }
}
