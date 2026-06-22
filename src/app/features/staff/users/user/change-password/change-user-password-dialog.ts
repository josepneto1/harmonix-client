import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { InputField } from '../../../../../shared/ui/lib/inputs/input/input-field';
import { SnackBarService } from '../../../../../shared/ui/lib/snackbar/services/snack-bar-service';
import { UserService } from '../../services/user-service';

interface IChangeUserPasswordDialogData {
  userId: string;
}

@Component({
  selector: 'app-change-user-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    InputField,
  ],
  templateUrl: './change-user-password-dialog.html',
  styleUrl: './change-user-password-dialog.scss',
})
export class ChangeUserPasswordDialog {
  private fb = inject(FormBuilder).nonNullable;
  private dialogRef = inject(MatDialogRef<ChangeUserPasswordDialog, boolean>);
  private data = inject(MAT_DIALOG_DATA) as IChangeUserPasswordDialogData;
  private userService = inject(UserService);
  private snackBar = inject(SnackBarService);

  isLoading: boolean = false;

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
  });

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    try {
      await firstValueFrom(
        this.userService.changePassword({
          id: this.data.userId,
          password: this.form.controls.password.value,
        })
      );

      this.snackBar.success('Senha atualizada com sucesso');
      this.dialogRef.close(true);
    } catch {
      this.snackBar.error('Não foi possível alterar a senha');
    } finally {
      this.isLoading = false;
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
