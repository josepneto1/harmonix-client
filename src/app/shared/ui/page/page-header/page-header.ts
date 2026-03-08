import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'hx-page-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './page-header.html',
  styleUrls: ['./page-header.scss'],
})
export class PageHeader {
  @Input() pageTitle!: string;
  @Input() search = false;
  @Input() searchPlaceholder = 'Buscar';
  @Output() searchChange = new EventEmitter<string>();

  searchTerm: string = '';

  onSearch(): void {
    this.searchChange.emit(this.searchTerm);
  }

  clear(): void {
    this.searchTerm = '';
    this.searchChange.emit('');
  }
}
