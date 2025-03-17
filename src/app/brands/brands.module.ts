import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog'; // Para mat-dialog-content, mat-dialog-actions, etc.
import { MatFormFieldModule } from '@angular/material/form-field'; // Para mat-form-field
import { MatInputModule } from '@angular/material/input'; // Para input dentro de mat-form-field
import { ReactiveFormsModule } from '@angular/forms'; // Para formGroup e ReactiveForms

import { BrandModalComponent } from './brand-modal/brand-modal.component';
import { BrandListComponent } from './brands-list/brands-list.component';

@NgModule({
  declarations: [
    BrandModalComponent,
    BrandListComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [
    BrandModalComponent, // Exportar se necessário
    BrandListComponent
  ]
})
export class BrandsModule { }
