import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SnackBarService } from '../../ui/lib/snackbar/services/snack-bar-service';

@Injectable({
  providedIn: 'root',
})
export class ApiHelperService {
  private http = inject(HttpClient);
  private snackBar = inject(SnackBarService);

  private apiUrl = environment.apiUrl;

  private url(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }

  private handleError() {
    return (err: any) => {
      const msg = err?.error?.message || err?.message;
      this.snackBar.error(msg);
      return throwError(() => err);
    };
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.url(endpoint))
      .pipe(catchError(this.handleError()));
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(endpoint), body)
      .pipe(catchError(this.handleError()));
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.url(endpoint), body)
      .pipe(catchError(this.handleError()));
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.url(endpoint), body)
      .pipe(catchError(this.handleError()));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.url(endpoint))
      .pipe(catchError(this.handleError()));
  }
}
