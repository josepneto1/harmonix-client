import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { ISnackbarData } from './interfaces/snack-bar-data.interface';
import { ESnackBarType } from './enums/snack-bar-type.enum';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hx-snackbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule, 
    MatButtonModule, 
    MatProgressBarModule
  ],
  templateUrl: './snack-bar.html',
  styleUrl: './snack-bar.scss',
})
export class SnackBar {
  private snackBarRef = inject(MatSnackBarRef<SnackBar>);
  private cdRef = inject(ChangeDetectorRef);

  data = inject<ISnackbarData>(MAT_SNACK_BAR_DATA);

  type = ESnackBarType;
  progress = 0;

  constructor() {
    this.startProgressBar(this.data.duration);
  }

  startProgressBar(ms: number) {
    const step = 100 / (ms / 100);

    const interval = setInterval(() => {
      this.progress += step;
      this.cdRef.detectChanges();

      if (this.progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  }

  close() {
    this.snackBarRef.dismiss();
  }
}
