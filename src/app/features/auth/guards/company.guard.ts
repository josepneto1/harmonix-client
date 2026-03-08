import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { map } from 'rxjs';

export const companyGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const routeCompany = route.paramMap.get('companyAlias');

  return authService.checkAuth().pipe(
    map(isAuth => {
      if (!isAuth) return router.createUrlTree(['/login']);

      const userCompany = authService.getCompanyAlias();

      if (routeCompany !== userCompany) return router.createUrlTree([`/${userCompany}/home`]);

      return true;
    })
  );
};
