import {
  Component,
  forwardRef,
  Input,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'hx-date-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './date-input.html',
  styleUrl: './date-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInput),
      multi: true,
    },
  ],
})
export class DateInput implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'DD/MM/AAAA';

  displayValue = signal('');
  isDisabled = signal(false);
  touched = signal(false);
  hasError = signal(false);

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart ?? 0;
    const prevLen = this.displayValue().length;

    const digits = input.value.replace(/\D/g, '').substring(0, 8);
    const masked = this.applyMask(digits);

    input.value = masked;
    this.displayValue.set(masked);

    const added = masked.length - prevLen;
    const newPos = added > 1 ? cursorPos + (added - 1) : cursorPos;
    input.setSelectionRange(newPos, newPos);

    if (digits.length === 8) {
      const date = this.parseDate(digits);
      this.hasError.set(!date);
      this.onChange(date);
    } else {
      this.hasError.set(false);
      this.onChange(null);
    }
  }

  onBlur(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
    }
  }

  writeValue(value: Date | null): void {
    if (value) {
      const d = value instanceof Date ? value : new Date(value);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      this.displayValue.set(`${day}/${month}/${year}`);
    } else {
      this.displayValue.set('');
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private applyMask(digits: string): string {
    let masked = digits.substring(0, 2);
    if (digits.length > 2) masked += '/' + digits.substring(2, 4);
    if (digits.length > 4) masked += '/' + digits.substring(4, 8);
    return masked;
  }

  private parseDate(digits: string): Date | null {
    const day = parseInt(digits.substring(0, 2), 10);
    const month = parseInt(digits.substring(2, 4), 10) - 1;
    const year = parseInt(digits.substring(4, 8), 10);

    const date = new Date(year, month, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }
}
