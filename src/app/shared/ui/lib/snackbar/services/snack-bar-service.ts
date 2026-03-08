import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ESnackBarType } from '../enums/snack-bar-type.enum';
import { SnackBar } from '../snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar);

  success(message: string, duration = 4000) {
    this.open(message, ESnackBarType.Success, duration);
  }

  error(message: string, duration = 4000) {
    this.open(message, ESnackBarType.Error, duration);
  }

  private open(message: string, type: ESnackBarType, duration: number) {
    this.snackBar.openFromComponent(SnackBar, {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: 'snackbar-container',
      data: {
        message,
        type,
        duration
      }
    });
  }
}
