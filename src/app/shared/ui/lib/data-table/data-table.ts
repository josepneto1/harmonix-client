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
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator }
  ]
})
export class DataTable<T> implements AfterViewInit, OnChanges {
  @Input() columns: ITableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() filterPlaceholder = 'Filtrar';
  @Input() filter = '';

  @Output() selectedItem = new EventEmitter<T>()

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSize: number[] = [25, 50, 100];

  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges) {

    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
    }

    if (changes['columns']) {
      this.displayedColumns = this.columns.map(c => c.key);
    }

    if (changes['filter']) {
      this.applyExternalFilter(this.filter);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyExternalFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.paginator?.firstPage();
  }

  format(cell: any, column: ITableColumn<T>, row: T) {
    return column.formatter ? column.formatter(cell, row) : cell;
  }
}
