import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { Button } from '../../../shared/ui/lib/buttons/button/button';
import { InputField } from '../../../shared/ui/lib/inputs/input/input-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSnackBarModule,
    Button,
    InputField,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  isLoading = signal(false);

  constructor() {
    this.form = this.fb.group({
      email: ['admin@admin.com', [Validators.required, Validators.email]],
      password: ['admin', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        if (this.authService.isSysAdmin()) {
          this.router.navigate(['/staff/companies']).then(() => {
            this.isLoading.set(false);
          });

          return;
        }
        const company = this.authService.getCompanyAlias();

        if (!company) {
          this.snackBar.open('Erro ao obter empresa do usuário', 'Fechar', {
            duration: 7000
          });
          this.isLoading.set(false);
          return;
        }

        this.router.navigate([`/${company}/home`]).then(success => {
          if (!success) {
            this.snackBar.open('Erro ao redirecionar', 'Fechar', {
              duration: 7000
            });
          }
          this.isLoading.set(false);
        });
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
