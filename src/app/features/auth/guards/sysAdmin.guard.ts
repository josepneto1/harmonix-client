import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { map } from 'rxjs';

export const sysAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checkAuth().pipe(
    map(isAuth => {
      if (!isAuth) return router.createUrlTree(['/login']);

      if (!auth.isSysAdmin()) {
        return router.createUrlTree(['/login']);
      }

      return true;
    })
  );
};
