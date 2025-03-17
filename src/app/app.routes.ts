import { Routes } from '@angular/router';
import { BrandListComponent } from './brands/brands-list/brands-list.component';

export const routes: Routes = [
  { path: 'brands', component: BrandListComponent }, // Rota para a lista de marcas
  { path: '', redirectTo: '/brands', pathMatch: 'full' }, // Rota padrão
  { path: '**', redirectTo: '/brands' } // Rota de fallback
];
