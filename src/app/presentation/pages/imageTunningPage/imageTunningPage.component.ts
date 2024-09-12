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
  GptMessageEditableImageComponent,
  MyMessageComponent,
  TextMessageBoxComponent,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-tunning-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    ReactiveFormsModule,
    TextMessageBoxComponent,
    GptMessageEditableImageComponent,
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {
  messages = signal<Message[]>([
  ]);
  isLoading = signal(false);
  openAiService = inject(OpenAiService);

  originalImage = signal<string | undefined>(undefined);
  maskImage = signal<string | undefined>(undefined);

  handleMessage(prompt: string) {
    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { isGpt: false, text: prompt }]);

    this.openAiService.imageGeneration(prompt, this.originalImage(), this.maskImage()).subscribe({
      next: (resp) => {
        if (!resp) return;
        this.messages.update((prev) => [
          ...prev,
          {
            isGpt: true,
            text: resp.alt,
            imageInfo: resp,
          },
        ]);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  handleImageChange(newImage: string, originalImage: string) {
    this.originalImage.set(originalImage);
    this.maskImage.set(newImage);
  }

  generationVariation() {
    if (!this.originalImage()!) return;
    this.isLoading.set(true);
    this.openAiService.imageVariation(this.originalImage()!).subscribe({
      next: (resp) => {
        if (!resp) return;

        this.messages.update((prev) => [
          ...prev,
          {
            isGpt: true,
            text: 'Imagen variations',
            imageInfo: resp,
          },
        ]);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
