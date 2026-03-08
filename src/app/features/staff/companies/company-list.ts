import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Page } from '../../../shared/ui/page/page';
import { DataTable } from '../../../shared/ui/lib/data-table/data-table';
import { Button } from '../../../shared/ui/lib/buttons/button/button';
import { CompanyService } from './services/company-service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ICompanies } from './company/interfaces/companies.interface';
import { RefreshService } from '../../../shared/http/services/refresh-service';
import { firstValueFrom } from 'rxjs';
import { DateUtils } from '../../../shared/utils/date-utils';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    Page,
    DataTable,
    Button,
    MatButtonModule,
    RouterOutlet
  ],
  templateUrl: './company-list.html',
  styleUrl: './company-list.scss',
})
export class CompanyList {
  private companyService = inject(CompanyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private refreshService = inject(RefreshService);
  
  searchTerm = '';

  companies = signal<ICompanies[]>([]);

  columns = [
    { key: 'id', label: 'Id', sortable: true, minWidth: '280px' },
    { key: 'name', label: 'Nome', sortable: true, minWidth: '200px' },
    { key: 'alias', label: 'Alias', sortable: true, minWidth: '200px' },
    { key: 'createdAt', label: 'Criado em', sortable: true, minWidth: '200px', formatter: DateUtils.format },
    { key: 'expirationDate', label: 'Expira em', sortable: true, minWidth: '200px', formatter: DateUtils.format },
  ];

  constructor() {
    effect(() => {
      this.refreshService.refresh();
      this.load();
    });
  }

  async load(): Promise<void> {
    try {
      const companies = await firstValueFrom(this.companyService.listCompanies());
      this.companies.set(companies);
    } finally {
      
    }
  }

  onSearch(term: string): void {
    this.searchTerm = term;
  }

  add() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  openEdit(company: ICompanies): void {
    this.router.navigate([company.id, 'edit'], { relativeTo: this.route });
  }
}
