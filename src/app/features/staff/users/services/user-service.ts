import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService } from '../../../../shared/http/services/api-helper-service';
import { IUser } from '../interfaces/user.interface';
import { IQueryParams } from '../../../../shared/http/services/interfaces/query-params.interface';
import { IQueryResponse } from '../../../../shared/http/services/interfaces/query-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(ApiHelperService);

  listUsers(params: IQueryParams): Observable<IQueryResponse<IUser>> {
    return this.api.get<IQueryResponse<IUser>>('staff/users/list', params);
  }

  getById(id: string): Observable<IUser> {
    return this.api.get<IUser>(`staff/users/user/${id}`);
  }

  create(data: Record<string, unknown>): Observable<IUser> {
    return this.api.post<IUser>('staff/users/create', data);
  }

  update(data: Record<string, unknown>): Observable<void> {
    return this.api.patch<void>('staff/users/update', data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`staff/users/delete/${id}`);
  }
}
