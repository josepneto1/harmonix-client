import { Injectable, inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Injectable({ 
  providedIn: 'root' 
})
export class SheetService {
  private matBottomSheet = inject(MatBottomSheet);
  
  private bottomSheetRef?: MatBottomSheetRef;
  private currentTitle?: string;
  isFormDirty = false;
  

  async open(
    component: any, 
    config?: { title?: string; params?: any; data?: any }
  ): Promise<void> {
    if (this.bottomSheetRef) return;

    this.currentTitle = config?.title;

    this.bottomSheetRef = this.matBottomSheet.open(component, {
      panelClass: ['hx-sheet-container'],
      disableClose: true,
      data: {
        title: config?.title,
        params: config?.params,
        routeData: config?.data
      }
    }) as MatBottomSheetRef<any>;

    this.bottomSheetRef.afterDismissed().subscribe(() => {
      this.bottomSheetRef = undefined;
      this.isFormDirty = false;
    });
  }

  async close(): Promise<boolean> {
    if (!this.bottomSheetRef) {
      return true;
    }

    // Se o formulário não está sujo, fecha direto
    if (!this.isFormDirty) {
      this.bottomSheetRef.dismiss();
      this.isFormDirty = false;
      return true;
    }

    // Aqui você pode adicionar lógica de confirmação
    // Por enquanto, sempre permite fechar
    // TODO: Implementar diálogo de confirmação se necessário
    this.bottomSheetRef.dismiss();
    this.isFormDirty = false;
    return true;
  }

  setFormDirty(isDirty: boolean): void {
    this.isFormDirty = isDirty;
  }

  isOpen(): boolean {
    return !!this.bottomSheetRef;
  }
}
