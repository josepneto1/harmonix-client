import { Component, Input, signal, forwardRef, OnInit, DoCheck, inject, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, ControlContainer, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'hx-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputField),
      multi: true
    }
  ]
})
export class InputField implements OnInit, DoCheck {
  private controlContainer = inject(ControlContainer, { optional: true });
  private cdRef = inject(ChangeDetectorRef);

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() value?: string;
  @Input() formControlName!: string;
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() showPasswordToggle: boolean = false;
  @Input() maxLength?: number;

  @Output() readonly valueChanged = new EventEmitter<string>();

  hidePassword = signal(true);
  control!: FormControl;
  isDisabled = false;

  onChange: (value?: string) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    this.getFormControl();

    if (!this.control.value && this.value) {
      this.control.setValue(this.value, { emitEvent: false });
    }
  }

  ngDoCheck(): void {
    this.cdRef.markForCheck();
  }

  getFormControl(): void {
    this.control = (this.controlContainer?.control?.get(this.formControlName) as FormControl) ?? new FormControl();
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  getInputType(): string {
    if (this.type === 'password' && this.showPasswordToggle) {
      return this.hidePassword() ? 'password' : 'text';
    }
    return this.type;
  }

  getErrorMessage(): string {
    if (!this.control) return '';

    const errors = this.control.errors;
    if (!errors) return '';

    for (const errorKey in errors) {
      if (this.errorMessages[errorKey]) {
        return this.errorMessages[errorKey];
      }
    }

    if (errors['required']) return 'Este campo é obrigatório';
    if (errors['email']) return 'Email inválido';
    if (errors['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `Máximo de ${maxLength} caracteres`;
    }
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo: ${errors['max'].max}`;
    if (errors['pattern']) return 'Formato inválido';

    return 'Campo inválido';
  }

  get isInvalid(): boolean {
    return !!(this.control?.invalid && this.control?.touched);
  }

  writeValue(value: any): void {
    if (!this.control) return;

    if (this.control.value !== value) {
      this.control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: any): void {
    const value = event.target.value;
    this.onChange(value);
    this.valueChanged.emit(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
