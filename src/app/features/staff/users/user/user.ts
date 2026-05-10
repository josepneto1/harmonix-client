import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private companyService = inject(CompanyService);
  private sheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true });
  private refreshService = inject(RefreshService);
  private snackBar = inject(SnackBarService);

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
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
  });

  ngOnInit(): void {
    const id = this.sheetData?.params?.id;

    if (id) {
      this.userId = id;
      this.title = 'Editar usuário';
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.form.get('companyId')?.disable();
      this.loadUser(id);
    } else {
      this.title = 'Novo usuário';
      this.loadCompanies();
      this.refreshActions();
    }
  }

  async loadCompanies(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.companyService.listCompanies({ page: 1, pageSize: 200, sortBy: 'name', sortDirection: 'asc' })
      );
      this.companies.set(result.data);
    } catch {
      this.companies.set([]);
    }
  }

  loadUser(id: string): void {
    this.isLoading = true;

    this.userService.getById(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
        });

        this.refreshActions();
        this.form.markAsPristine();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  async save(): Promise<void> {
    if (!this.isValidForm()) return;

    const formValue = this.form.getRawValue();
    this.isLoading = true;

    try {
      if (this.userId) {
        await firstValueFrom(this.userService.update({
          id: this.userId,
          name: formValue.name,
          email: formValue.email,
          role: formValue.role,
        }));
        this.snackBar.success('Usuário atualizado com sucesso');
      } else {
        await firstValueFrom(this.userService.create({
          companyId: formValue.companyId,
          name: formValue.name,
          email: formValue.email,
          role: formValue.role,
          password: formValue.password,
        }));
        this.snackBar.success('Usuário criado com sucesso');
      }

      this.form.markAsPristine();
      this.hasChanges = true;
      this.closeSheet();
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
    } finally {
      this.isLoading = false;
    }
  }

  async onSheetAction(action: IActionButtonItem): Promise<void> {
    switch (action.id) {
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
      { id: 'delete', label: 'Excluir', icon: 'delete' },
    ];
  }

  private isValidForm(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }
}
