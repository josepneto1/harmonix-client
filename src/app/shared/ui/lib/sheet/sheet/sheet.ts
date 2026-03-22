import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Button } from '../../buttons/button/button';
import { ISheetData } from './interfaces/sheet-data.interface';
import { MatDividerModule } from '@angular/material/divider';
import { IActionButtonItem } from '../../buttons/action-button/interfaces/action-button-item.interface';
import { ActionButton } from '../../buttons/action-button/action-button';

@Component({
  selector: 'hx-sheet',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    Button,
    MatDividerModule,
    ActionButton
  ],
  templateUrl: './sheet.html',
  styleUrl: './sheet.scss',
})
export class Sheet {
  data = inject<ISheetData>(MAT_BOTTOM_SHEET_DATA);

  @Input() saveDisabled = false;
  @Input() actions: IActionButtonItem[] = [];
  
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() actionSelected = new EventEmitter<IActionButtonItem>();
  @Output() actionsMenuOpened = new EventEmitter<void>();

  get sheetTitle(): string {
    return this.data?.sheetTitle ?? '';
  }

  onSave() {
    this.save.emit();
  }

  onClose() {
    this.close.emit();
  }

  onActionSelected(action: IActionButtonItem): void {
    this.actionSelected.emit(action);
  }

  onActionsMenuOpened(): void {
    this.actionsMenuOpened.emit();
  }
}
