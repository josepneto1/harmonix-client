import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ITableColumn } from './models/data-table.model';
import { CustomPaginator } from './utils/custom-paginator';

@Component({
  selector: 'hx-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class DataTable<T> implements AfterViewInit, OnChanges {
  @Input() columns: ITableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() filterPlaceholder = 'Filtrar';
  @Input() filter = '';

  @Input() serverSide = false;
  @Input() total = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 25;
  @Input() pageSizeOptions: number[] = [25, 50, 100];
  @Input() activeSort = '';
  @Input() sortDirection: 'asc' | 'desc' | '' = '';

  @Output() selectedItem = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
    }

    if (changes['columns']) {
      this.displayedColumns = this.columns.map((column) => column.key);
    }

    if (!this.serverSide && changes['filter']) {
      this.applyExternalFilter(this.filter);
    }
  }

  ngAfterViewInit() {
    if (!this.serverSide) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onSortChange(event: Sort) {
    this.sortChange.emit(event);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  applyExternalFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.paginator?.firstPage();
  }

  format(cell: any, column: ITableColumn<T>, row: T) {
    return column.formatter ? column.formatter(cell, row) : cell;
  }
}
