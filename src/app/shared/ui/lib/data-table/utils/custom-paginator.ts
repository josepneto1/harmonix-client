import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomPaginator extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página:';
  override nextPageLabel = '';
  override previousPageLabel = '';
  override firstPageLabel = '';
  override lastPageLabel = '';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0)
      return `Página 1 de 1 (0 itens)`;

    const totalPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${totalPages} (${length} ${length === 1 ? 'item' : 'itens'})`;
  };
}