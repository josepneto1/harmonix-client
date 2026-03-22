import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate } from '@angular/router';
import { SheetService } from '../services/sheet-service';

export interface OnSheetDeactivate {
  onDeactivate?: () => boolean | Promise<boolean>;
}

@Injectable({ providedIn: 'root' })
export class SheetGuard implements CanActivate, CanDeactivate<OnSheetDeactivate> {
  private sheetService = inject(SheetService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const component = route.data['bottomSheet'];
    const sheetTitle = route.data['sheetTitle'];

    if (component && !this.sheetService.isOpen()) {
      this.sheetService.open(component, {
        sheetTitle,
        params: route.params,
        data: route.data
      });
    }

    return true;
  }

  canDeactivate(component?: OnSheetDeactivate): boolean | Promise<boolean> {
    if (component?.onDeactivate) {
      const result = component.onDeactivate();
      if (result === false) return false;
    }

    return this.sheetService.close();
  }
}
