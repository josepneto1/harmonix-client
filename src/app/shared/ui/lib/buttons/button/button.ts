import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hx-button',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() matBtnType: 'outlined' | 'filled' = 'filled';
  @Input() color: 'primary' | 'success' | 'error' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() size: 'small' | '' = '';
  @Input() disabled: boolean = false;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() fullWidth: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
