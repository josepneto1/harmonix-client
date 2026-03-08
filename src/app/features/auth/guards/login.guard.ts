import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map(isAuth => {
      if (isAuth) {
        if (authService.isSysAdmin()) return router.createUrlTree(['/staff']);

        const company = authService.getCompanyAlias();
        if (company) return router.createUrlTree([`/${company}/home`]);

        return router.createUrlTree(['/login']);
      }

      return true;
    })
  );
};
