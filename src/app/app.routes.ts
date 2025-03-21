import { Routes } from '@angular/router';
import { BrandListComponent } from './brands/brands-list/brands-list.component';
import { VehiclesListComponent } from './vehicles/vehicles-list/vehicles-list.component';
import { CategoriesListComponent } from './category/categories-list/categories-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';


export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoriesListComponent },
  { path: 'vehicles', component: VehiclesListComponent },
  { path: 'brands', component: BrandListComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
