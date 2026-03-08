import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHelperService } from "../../../../shared/http/services/api-helper-service";

@Injectable({
  providedIn: 'root'
})
export class CompanyService { 
  private api = inject(ApiHelperService);

  listCompanies(): Observable<any[]> {
    return this.api.get<any[]>('staff/companies/list');
  }

  getById(id: string): Observable<any> {
    return this.api.get<any>(`staff/companies/company/${id}`);
  }

  create(data: any): Observable<any> {
    return this.api.post<any>('staff/companies/create', data);
  }

  update(data: any): Observable<void> {
    return this.api.patch<void>(`staff/companies/update`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`staff/companies/delete/${id}`);
  }

  changeStatus(data: any): Observable<void> {
    return this.api.patch<void>('staff/companies/changeStatus', data);
  }
}
