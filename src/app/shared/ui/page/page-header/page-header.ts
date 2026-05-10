import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../features/auth/auth.service';

@Component({
  selector: 'hx-page-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './page-header.html',
  styleUrls: ['./page-header.scss'],
})
export class PageHeader {
  private authService = inject(AuthService);

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

  logout(): void {
    this.authService.logout();
  }
}
