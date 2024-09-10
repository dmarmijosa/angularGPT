import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface TextMessageInterface {
  file: File;
  prompt?: string | null;
}

@Component({
  selector: 'app-text-message-box-file',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './textMessageBoxFile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxFileComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() disableCorrections: boolean = false;

  @Output() onMessage = new EventEmitter<TextMessageInterface>();
  private router = inject(Router);
  typeOfFile =  signal('');

  ngOnInit(): void {
    if (this.router.url === '/audio-to-text') {
      this.typeOfFile.set('audio/mp3');
    } else {
      this.typeOfFile.set('application/pdf'); // Puedes cambiar este valor según lo que necesites en otras rutas
    }
  }

  private fb = inject(FormBuilder);
  form = this.fb.group({
    prompt: [],
    file: [null, Validators.required],
  });
  public file: File | undefined;

  handleSelectedFile(event: any) {
    const file = event.target.files.item(0);
    this.form.controls.file.setValue(file);
  }

  handleSubmit() {
    if (this.form.valid) {
      const { prompt, file } = this.form.value;

      this.onMessage.emit({ prompt, file: file! });
      this.form.reset();
    }
  }
}
