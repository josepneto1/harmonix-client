import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiHelperService } from '../../../shared/http/services/api-helper-service';
import { IQueryParams } from '../../../shared/http/services/interfaces/query-params.interface';
import { IQueryResponse } from '../../../shared/http/services/interfaces/query-response.interface';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private api = inject(ApiHelperService);

  listProducts(params: IQueryParams): Observable<IQueryResponse<IProduct>> {
    return this.api.get<IQueryResponse<IProduct>>('products/list', params);
  }
}
