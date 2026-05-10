import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { Page } from '../../../shared/ui/page/page';
import { DataTable } from '../../../shared/ui/lib/data-table/data-table';
import { Button } from '../../../shared/ui/lib/buttons/button/button';
import { RefreshService } from '../../../shared/http/services/refresh-service';
import { DateUtils } from '../../../shared/utils/date-utils';
import { UserService } from './services/user-service';
import { IUser } from './interfaces/user.interface';

@Component({
  selector: 'app-users',
  imports: [
    Page,
    DataTable,
    Button,
    RouterOutlet,
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private refreshService = inject(RefreshService);

  searchTerm: string = '';

  users = signal<IUser[]>([]);
  total = signal(0);

  pageIndex = 0;
  pageSize = 25;
  activeSort = 'createdAt';
  sortDirection: 'asc' | 'desc' | '' = 'desc';

  columns = [
    { key: 'id', label: 'Id', sortable: true, minWidth: '280px' },
    { key: 'name', label: 'Nome', sortable: true, minWidth: '280px' },
    { key: 'email', label: 'E-mail', sortable: true, minWidth: '230px' },
    { key: 'companyName', label: 'Clínica', sortable: true, minWidth: '200px' },
    { key: 'role', label: 'Papel', sortable: true, minWidth: '120px' },
    {
      key: 'createdAt',
      label: 'Criado em',
      sortable: true,
      minWidth: '150px',
      formatter: DateUtils.format,
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
      this.userService.listUsers({
        page: this.pageIndex + 1,
        pageSize: this.pageSize,
        search: this.searchTerm,
        sortBy: this.activeSort,
        sortDirection: this.sortDirection,
      })
    );

    this.users.set(result.data);
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

  add(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  openEdit(user: IUser): void {
    this.router.navigate([user.id, 'edit'], { relativeTo: this.route });
  }
}
