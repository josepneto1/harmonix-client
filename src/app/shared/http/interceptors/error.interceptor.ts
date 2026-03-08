import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackBarService } from '../../ui/lib/snackbar/services/snack-bar-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(SnackBarService);

  return next(req).pipe(
    catchError((err) => {

      const message =
        err?.error?.message ||
        'Erro inesperado';

      snackBar.error(message);

      return throwError(() => err);
    })
  );
};
