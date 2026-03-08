import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // n interceptar login/refresh
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = authService.getAccessToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err);

      return authService.refreshToken().pipe(
        switchMap(success => {
          if (!success) return throwError(() => err);

          const newToken = authService.getAccessToken();
          if (!newToken) return throwError(() => err);

          const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });

          return next(retryReq);
        })
      );
    })
  );
};
