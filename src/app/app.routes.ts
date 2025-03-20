import { Routes } from '@angular/router';
import { BrandListComponent } from './brands/brands-list/brands-list.component';
import { VehiclesListComponent } from './vehicles/vehicles-list/vehicles-list.component';
import { CategoriesListComponent } from './category/categories-list/categories-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent},
  { path: 'categories', component: CategoriesListComponent},
  { path: 'vehicles', component: VehiclesListComponent},
  { path: 'brands', component: BrandListComponent }, // Rota para a lista de marcas
  { path: '', redirectTo: '/brands', pathMatch: 'full' }, // Rota padrão
  { path: '**', redirectTo: '/brands' } // Rota de fallback
];
