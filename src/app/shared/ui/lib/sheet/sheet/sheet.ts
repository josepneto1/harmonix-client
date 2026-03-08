import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Button } from '../../buttons/button/button';
import { ISheetData } from './interfaces/sheet-data.interface';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'hx-sheet',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    Button,
    MatDividerModule
  ],
  templateUrl: './sheet.html',
  styleUrl: './sheet.scss',
})
export class Sheet {
  data = inject<ISheetData>(MAT_BOTTOM_SHEET_DATA);

  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  get title(): string {
    return this.data?.title ?? '';
  }

  onSave() {
    this.save.emit();
  }

  onClose() {
    this.close.emit();
  }
}
