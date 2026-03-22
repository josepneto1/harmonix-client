import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IActionButtonItem } from './interfaces/action-button-item.interface';

@Component({
  selector: 'hx-action-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './action-button.html',
  styleUrl: './action-button.scss',
})
export class ActionButton {
  @Input() label: string = 'Opcoes';
  @Input() icon: string = 'more_vert';
  @Input() disabled: boolean = false;
  @Input() actions: IActionButtonItem[] = [];

  @Output() actionSelected = new EventEmitter<IActionButtonItem>();
  @Output() menuOpened = new EventEmitter<void>();

  onActionClick(action: IActionButtonItem): void {
    if (action.disabled) return;
    this.actionSelected.emit(action);
  }
}
