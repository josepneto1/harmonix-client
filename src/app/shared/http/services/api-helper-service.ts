import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiHelperService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  private url(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }

  get<T, Params = Record<string, any>>(
    endpoint: string,
    params?: Params
  ): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      const urlParams = Object.entries(params as Record<string, any>);
      for (const [key, value] of urlParams) {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      }
    }

    return this.http
      .get<T>(this.url(endpoint), { params: httpParams });
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(endpoint), body);
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.url(endpoint), body);
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.url(endpoint), body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.url(endpoint));
  }
}
