import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageHeader } from './page-header/page-header';

@Component({
  selector: 'hx-page',
  standalone: true,
  imports: [CommonModule, PageHeader],
  templateUrl: './page.html',
  styleUrl: './page.scss',
})
export class Page {
  @Input() pageTitle?: string;

  @Input() showHeader = false;
  @Input() showSearch = false;

  @Output() searchChange = new EventEmitter<string>();

  onSearch(term: string): void {
    this.searchChange.emit(term);
  }
}
