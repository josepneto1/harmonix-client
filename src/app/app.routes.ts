import { Routes } from '@angular/router';
import { Layout } from './shared/ui/layout/layout';
import { authGuard } from './features/auth/guards/auth.guard';
import { loginGuard } from './features/auth/guards/login.guard';
import { sysAdminGuard } from './features/auth/guards/sysAdmin.guard';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home';
import { Appointments } from './features/appointments/appointments';
import { Customers } from './features/customers/customers';
import { Products } from './features/products/products';
import { CompanyList } from './features/staff/companies/company-list';
import { Company } from './features/staff/companies/company/company';
import { EmptyPage } from './shared/ui/page/empty-page';
import { SheetGuard } from './shared/ui/lib/sheet/sheet/guards/sheet.guard';
import { UsersList } from './features/staff/users/users-list';
import { User } from './features/staff/users/user/user';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [loginGuard],
    title: 'Harmonix | Login',
  },
  {
    path: 'staff',
    component: Layout,
    canActivate: [sysAdminGuard],
    children: [
      { 
        path: 'companies', component: CompanyList, title: 'Harmonix | Clínicas', 
        children: [
          { 
            path: 'new', 
            component: EmptyPage,
            canActivate: [SheetGuard],
            canDeactivate: [SheetGuard],
            data: { 
              bottomSheet: Company, 
              sheetTitle: 'Nova clínica' 
            }
          },
          { 
          path: ':id/edit', 
          component: EmptyPage,
          canActivate: [SheetGuard],
          canDeactivate: [SheetGuard],
          data: { 
            bottomSheet: Company, 
            sheetTitle: 'Editar clínica',
          }
        }
      ]
      },
      {
        path: 'users', component: UsersList, title: 'Harmonix | Usuários',
        children: [
          {
            path: 'new',
            component: EmptyPage,
            canActivate: [SheetGuard],
            canDeactivate: [SheetGuard],
            data: {
              bottomSheet: User,
              sheetTitle: 'Novo usuário',
            }
          },
          {
            path: ':id/edit',
            component: EmptyPage,
            canActivate: [SheetGuard],
            canDeactivate: [SheetGuard],
            data: {
              bottomSheet: User,
              sheetTitle: 'Editar usuário',
            }
          }
        ]
      },
      {
        path: '',
        redirectTo: 'companies',
        pathMatch: 'full'
      }
    ],
  },
  {
    path: ':companyAlias',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: Home,
        title: 'Harmonix | Home',
      },
      {
        path: 'appointments',
        component: Appointments,
        title: 'Harmonix | Atendimentos',
      },
      {
        path: 'customers',
        component: Customers,
        title: 'Harmonix | Clientes',
      },
      {
        path: 'products',
        component: Products,
        title: 'Harmonix | Produtos',
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ],
  },
  { path: '**', redirectTo: '/login' },
];
