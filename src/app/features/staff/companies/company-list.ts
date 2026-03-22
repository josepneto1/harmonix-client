import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { Page } from '../../../shared/ui/page/page';
import { DataTable } from '../../../shared/ui/lib/data-table/data-table';
import { Button } from '../../../shared/ui/lib/buttons/button/button';
import { RefreshService } from '../../../shared/http/services/refresh-service';
import { DateUtils } from '../../../shared/utils/date-utils';
import { CompanyService } from './services/company-service';
import { ICompany } from './interfaces/company.interface';

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

  companies = signal<ICompany[]>([]);
  total = signal(0);

  pageIndex = 0;
  pageSize = 25;
  activeSort = 'createdAt';
  sortDirection: 'asc' | 'desc' | '' = 'desc';

  columns = [
    { key: 'id', label: 'Id', sortable: true, minWidth: '280px' },
    { key: 'name', label: 'Nome', sortable: true, minWidth: '440px' },
    { key: 'alias', label: 'Alias', sortable: true, minWidth: '150px' },
    {
      key: 'createdAt',
      label: 'Criado em',
      sortable: true,
      minWidth: '150px',
      formatter: DateUtils.format,
    },
    {
      key: 'expirationDate',
      label: 'Expira em',
      sortable: true,
      minWidth: '150px',
      formatter: DateUtils.format,
    },
    { 
      key: 'isActive', 
      label: 'Status', 
      sortable: false,
      minWidth: '100px', 
      formatter: (isActive: boolean) => isActive ? 'Ativo' : 'Inativo' 
    },
  ];

  constructor() {
    effect(() => {
      this.refreshService.refresh();
      this.load();
    });
  }

  async load(): Promise<void> {
    const result = await firstValueFrom(
      this.companyService.listCompanies({
        page: this.pageIndex + 1,
        pageSize: this.pageSize,
        search: this.searchTerm,
        sortBy: this.activeSort,
        sortDirection: this.sortDirection,
      })
    );

    this.companies.set(result.data);
    this.total.set(result.totalCount);

    this.pageIndex = result.page - 1;
    this.pageSize = result.pageSize;
  }

  async onSearch(term: string): Promise<void> {
    this.searchTerm = term;
    this.pageIndex = 0;
    await this.load();
  }

  async onSort(event: Sort): Promise<void> {
    this.activeSort = event.active;
    this.sortDirection = event.direction;
    this.pageIndex = 0;
    await this.load();
  }

  async onPage(event: PageEvent): Promise<void> {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.load();
  }

  add() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  openEdit(company: ICompany): void {
    this.router.navigate([company.id, 'edit'], { relativeTo: this.route });
  }
}
