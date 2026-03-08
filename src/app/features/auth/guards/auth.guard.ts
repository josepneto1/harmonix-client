import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const routeCompany = route.paramMap.get('companyAlias');

  return authService.checkAuth().pipe(
    map(isAuth => {
      if (!isAuth) return router.createUrlTree(['/login']);

      const userCompany = authService.getCompanyAlias();

      if (routeCompany && routeCompany !== userCompany) return router.createUrlTree([`/${userCompany}/home`]);

      return true;
    })
  );
};
