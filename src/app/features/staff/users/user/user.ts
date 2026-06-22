import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';

import { Sheet } from '../../../../shared/ui/lib/sheet/sheet/sheet';
import { InputField } from '../../../../shared/ui/lib/inputs/input/input-field';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { RefreshService } from '../../../../shared/http/services/refresh-service';
import { SnackBarService } from '../../../../shared/ui/lib/snackbar/services/snack-bar-service';
import { IActionButtonItem } from '../../../../shared/ui/lib/buttons/action-button/interfaces/action-button-item.interface';
import { UserService } from '../services/user-service';
import { CompanyService } from '../../companies/services/company-service';
import { ICompany } from '../../companies/interfaces/company.interface';
import { ERole } from '../../../../shared/models/enums/role';
import { ChangeUserPasswordDialog } from './change-password/change-user-password-dialog';

interface IUserSheetData {
  params?: {
    id?: string;
  };
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Sheet,
    InputField,
    MatSelectModule,
  ],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder).nonNullable;
  private userService = inject(UserService);
  private companyService = inject(CompanyService);
  private dialog = inject(MatDialog);
  private sheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true }) as IUserSheetData | null;
  private refreshService = inject(RefreshService);
  private snackBar = inject(SnackBarService);

  private readonly passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(20),
  ];

  title: string = 'Novo usuário';
  userId?: string;
  isLoading: boolean = false;
  hasChanges: boolean = false;

  actionsBtn: IActionButtonItem[] = [];
  roles = Object.values(ERole);
  companies = signal<ICompany[]>([]);

  form = this.fb.group({
    companyId: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    role: [ERole.User as ERole, [Validators.required]],
    password: ['', this.passwordValidators],
  });

  ngOnInit(): void {
    const id = this.sheetData?.params?.id;

    if (id) {
      this.userId = id;
      this.title = 'Editar usuário';
      this.setPasswordRequired(false);
      this.form.controls.companyId.disable();
      void this.loadUser(id);
    } else {
      this.title = 'Novo usuário';
      void this.loadCompanies();
      this.refreshActions();
    }
  }

  async loadCompanies(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.companyService.listCompanies({
          page: 1,
          pageSize: 200,
          sortBy: 'name',
          sortDirection: 'asc',
        })
      );
      this.companies.set(result.data);
    } catch {
      this.companies.set([]);
    }
  }

  async loadUser(id: string): Promise<void> {
    this.isLoading = true;

    try {
      const user = await firstValueFrom(this.userService.getById(id));

      this.form.patchValue({
        name: user.name,
        email: user.email,
        role: user.role,
      });

      this.refreshActions();
      this.form.markAsPristine();
    } catch {
      this.snackBar.error('Não foi possível carregar o usuário');
    } finally {
      this.isLoading = false;
    }
  }

  async save(): Promise<void> {
    if (!this.isValidForm()) return;

    const formValue = this.form.getRawValue();
    this.isLoading = true;

    try {
      if (this.userId) {
        await firstValueFrom(
          this.userService.update({
            id: this.userId,
            name: formValue.name,
            email: formValue.email,
            role: formValue.role,
          })
        );
        this.snackBar.success('Usuário atualizado com sucesso');
      } else {
        await firstValueFrom(
          this.userService.create({
            companyId: formValue.companyId,
            name: formValue.name,
            email: formValue.email,
            role: formValue.role,
            password: formValue.password,
          })
        );
        this.snackBar.success('Usuário criado com sucesso');
      }

      this.form.markAsPristine();
      this.hasChanges = true;
      this.closeSheet();
    } catch {
      this.snackBar.error('Não foi possível salvar o usuário');
    } finally {
      this.isLoading = false;
    }
  }

  async deleteUser(): Promise<void> {
    if (!this.userId) return;

    this.isLoading = true;

    try {
      await firstValueFrom(this.userService.delete(this.userId));
      this.snackBar.success('Usuário excluído com sucesso');
      this.hasChanges = true;
      this.closeSheet();
    } catch {
      this.snackBar.error('Não foi possível excluir o usuário');
    } finally {
      this.isLoading = false;
    }
  }

  async onSheetAction(action: IActionButtonItem): Promise<void> {
    switch (action.id) {
      case 'change-password':
        this.openChangePasswordDialog();
        break;
      case 'delete':
        await this.deleteUser();
        break;
    }
  }

  closeSheet(): void {
    if (this.hasChanges)
      this.refreshService.triggerRefresh();
    this.router.navigate(['/staff/users']);
  }

  refreshActions(): void {
    if (!this.userId) {
      this.actionsBtn = [];
      return;
    }

    this.actionsBtn = [
      { id: 'change-password', label: 'Alterar senha', icon: 'password' },
      { id: 'delete', label: 'Excluir', icon: 'delete' },
    ];
  }

  private openChangePasswordDialog(): void {
    if (!this.userId) return;

    this.dialog.open(ChangeUserPasswordDialog, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
      data: {
        userId: this.userId,
      },
    });
  }

  private setPasswordRequired(required: boolean): void {
    const passwordControl = this.form.controls.password;

    if (required) {
      passwordControl.setValidators(this.passwordValidators);
    } else {
      passwordControl.clearValidators();
      passwordControl.reset('', { emitEvent: false });
    }

    passwordControl.updateValueAndValidity();
  }

  private isValidForm(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }
}
