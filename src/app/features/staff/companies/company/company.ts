import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sheet } from '../../../../shared/ui/lib/sheet/sheet/sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { InputField } from '../../../../shared/ui/lib/inputs/input/input-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../services/company-service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { firstValueFrom } from 'rxjs';
import { RefreshService } from '../../../../shared/http/services/refresh-service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Sheet,
    InputField,
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

  title: string = 'Nova clínica';
  companyId?: string;
  isLoading = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    alias: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    expirationDate: ['', [Validators.required]],
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
            expirationDate: this.toDateInput(company.expirationDate),
            isActive: company.isActive
          });

          this.form.get('isActive')?.enable();

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
      expirationDate: new Date(formValue.expirationDate!)
    };

    this.isLoading = true;

    try {
      if (this.companyId) {
        await firstValueFrom(this.companyService.update(data));
      } else {
        await firstValueFrom(this.companyService.create(data));
      }

      this.refreshService.triggerRefresh();

      this.form.markAsPristine();
    } finally {
      this.isLoading = false;
      this.closeSheet();
    }
  }


  onClose(): void {
    this.closeSheet();
  }

  private isValidForm(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  private closeSheet(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private toDateInput(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // formato yyyy-MM-dd
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
      // sucesso
      control?.markAsPristine();
    } catch {
      control?.setValue(!isActive);
    } finally {
      this.isLoading = false;
    }
  }
}
