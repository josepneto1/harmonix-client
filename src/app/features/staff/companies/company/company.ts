import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sheet } from '../../../../shared/ui/lib/sheet/sheet/sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { InputField } from '../../../../shared/ui/lib/inputs/input/input-field';
import { DateInput } from '../../../../shared/ui/lib/inputs/date-input/date-input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../services/company-service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { firstValueFrom } from 'rxjs';
import { RefreshService } from '../../../../shared/http/services/refresh-service';
import { SnackBarService } from '../../../../shared/ui/lib/snackbar/services/snack-bar-service';
import { IActionButtonItem } from '../../../../shared/ui/lib/buttons/action-button/interfaces/action-button-item.interface';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Sheet,
    InputField,
    DateInput,
    MatSlideToggleModule
  ],
  templateUrl: './company.html',
  styleUrl: './company.scss',
})
export class Company implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private sheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true });
  private refreshService = inject(RefreshService);
  private snackBar = inject(SnackBarService);

  title: string = 'Nova clínica';
  companyId?: string;
  isLoading: boolean = false;
  hasCompanyChanges: boolean = false;

  actionsBtn: IActionButtonItem[] = [];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    alias: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    expirationDate: [null as Date | null, [Validators.required]],
    isActive: [{ value: true, disabled: false }]
  });

  ngOnInit(): void {
    const id = this.sheetData?.params?.id;

    if (id) {
      this.companyId = id;
      this.title = 'Editar clínica';
      this.loadCompany(id);
    } else {
      this.title = 'Nova clínica';
      this.refreshActions();
    }
  }

  loadCompany(id: string): void {
    this.isLoading = true;

    this.companyService.getById(id)
      .subscribe({
        next: (company) => {
          this.form.patchValue({
            name: company.name,
            alias: company.alias,
            expirationDate: new Date(company.expirationDate),
            isActive: company.isActive
          });

          this.refreshActions();

          if (!company.isActive)
            this.form.disable();

          this.form.markAsPristine();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  async save(): Promise<void> {
    if (!this.isValidForm()) return;

    const formValue = this.form.getRawValue();

    const data = {
      id: this.companyId,
      name: formValue.name,
      alias: formValue.alias,
      expirationDate: formValue.expirationDate,
    };

    this.isLoading = true;

    try {
      if (this.companyId) {
        await firstValueFrom(this.companyService.update(data));
        this.snackBar.success('Clinica atualizada com sucesso');
      } else {
        await firstValueFrom(this.companyService.create(data));
        this.snackBar.success('Clinica criada com sucesso');
      }

      this.form.markAsPristine();

      this.hasCompanyChanges = true;

      this.closeSheet();
    } finally {
      this.isLoading = false;
    }
  }

  private isValidForm(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  closeSheet(): void {
    if (this.hasCompanyChanges)
      this.refreshService.triggerRefresh();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  async onStatusToggle(isActive: boolean): Promise<void> {
    if (!this.companyId) return;

    this.isLoading = true;

    const data = {
      companyId: this.companyId,
      isActive: isActive
    };

    const control = this.form.get('isActive');

    try {
      await firstValueFrom(this.companyService.changeStatus(data));
      control?.setValue(isActive);
      
      if (!isActive)
        this.form.disable();
      else 
        this.form.enable();

      this.hasCompanyChanges = true;
    } catch {
      control?.setValue(!isActive);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteCompany() {
    console.log('deletou')
  }

  async onSheetAction(action: IActionButtonItem): Promise<void> {
    const isActive = this.form.get('isActive')?.value;
    switch (action.id) {
      case 'activate':
      case 'deactivate':
        await this.onStatusToggle(!isActive!);
      break;
      case 'delete':
        this.deleteCompany();
        break;
    }
  }

  private getActions(isActive: boolean): IActionButtonItem[] {
    return [
      {
        id: isActive ? 'deactivate' : 'activate',
        label: isActive ? 'Inativar' : 'Ativar',
        icon: isActive ? 'toggle_off' : 'toggle_on'
      },
      {
        id: 'delete',
        label: 'Excluir',
        icon: 'delete',
      }
    ];
  }

  refreshActions(): void {
    if (!this.companyId) {
      this.actionsBtn = [];
      return;
    }

    const isActive = this.form.get('isActive')?.value ?? true;
    this.actionsBtn = this.getActions(isActive);
  }
}
