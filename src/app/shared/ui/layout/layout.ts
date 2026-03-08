import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../features/auth/auth.service';

interface IMenuItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class Layout {
  private router = inject(Router);
  private authService = inject(AuthService);

  menuExpanded = signal(true);

  isSysAdmin = this.authService.isSysAdmin();
  companyAlias = this.authService.getCompanyAlias();
  menuItems: IMenuItem[] = [];

  constructor() {
    this.setMenuItems();
  }

  private setMenuItems(): void {
    if (this.isSysAdmin) {
      this.menuItems = [
        { path: `/staff/companies`, label: 'Clínicas', icon: 'business' },
        { path: `/staff/users`, label: 'Usuários', icon: 'people' },
      ];
      return;
    }
    
    if (!this.companyAlias) return;
    
    this.menuItems = [
      { path: `/${this.companyAlias}/home`, label: 'Home', icon: 'home' },
      { path: `/${this.companyAlias}/appointments`, label: 'Atendimentos', icon: 'event' },
      { path: `/${this.companyAlias}/customers`, label: 'Clientes', icon: 'people' },
      { path: `/${this.companyAlias}/products`, label: 'Produtos', icon: 'inventory_2' },
    ];
  }

  toggleMenu(): void {
    this.menuExpanded.update(v => !v);
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  openProfile(): void {
    this.authService.logout();
    console.log('logout')
  }

  logout(): void {
    this.authService.logout();
  }
}
