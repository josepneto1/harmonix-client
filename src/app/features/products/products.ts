import { Component, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { Page } from '../../shared/ui/page/page';
import { DataTable } from '../../shared/ui/lib/data-table/data-table';
import { DateUtils } from '../../shared/utils/date-utils';
import { ProductService } from './services/product-service';
import { IProduct } from './interfaces/product.interface';
import { ITableColumn } from '../../shared/ui/lib/data-table/models/data-table.model';
import { RefreshService } from '../../shared/http/services/refresh-service';

@Component({
  selector: 'app-products',
  imports: [
    Page,
    DataTable,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private productService = inject(ProductService);
  private refreshService = inject(RefreshService);

  searchTerm = '';

  products = signal<IProduct[]>([]);
  total = signal(0);

  pageIndex = 0;
  pageSize = 25;
  activeSort = 'createdAt';
  sortDirection: 'asc' | 'desc' | '' = 'desc';

  columns: ITableColumn<IProduct>[] = [
    { key: 'code', label: 'Código', sortable: true, minWidth: '130px' },
    { key: 'name', label: 'Nome', sortable: true, minWidth: '260px' },
    { key: 'description', label: 'Descricao', sortable: true, minWidth: '320px' },
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
      void this.load();
    });
  }

  async load(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.productService.listProducts({
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchTerm,
          sortBy: this.activeSort,
          sortDirection: this.sortDirection,
        })
      );

      this.products.set(result.data);
      this.total.set(result.totalCount);
      this.pageIndex = result.page - 1;
      this.pageSize = result.pageSize;
    } catch {
      this.products.set([]);
      this.total.set(0);
    }
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
}
