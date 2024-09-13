import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface Option {
  id: string;
  text: string;
}

export interface TextMessageBoxEvent {
  prompt: string;
  selectedOption: string;
}
@Component({
  selector: 'app-text-message-box-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './textMessageBoxSelect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxSelectComponent {
  @Input() placeholder: string = '';
  @Input() disableCorrections: boolean = false;
  @Input({ required: true }) options!: Option[];

  @Output() onMessage = new EventEmitter<TextMessageBoxEvent>();

  private fb = inject(FormBuilder);
  form = this.fb.group({
    prompt: ['', Validators.required],
    selectedOption: ['', Validators.required],
  });

  handleSubmit() {
    if (this.form.valid) {
      const { prompt, selectedOption } = this.form.value;
      this.onMessage.emit({ prompt: prompt!, selectedOption: selectedOption! });
      this.form.reset({
        prompt:'',
        selectedOption:''
      });
    }
  }
}
