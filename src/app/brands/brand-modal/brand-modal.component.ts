import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrandService, Brand } from '../brands.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-brand-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './brand-modal.component.html',
  styleUrls: ['./brand.modal.component.scss']
})
export class BrandModalComponent implements OnInit {
  brandForm!: FormGroup;
  isEditMode: boolean = false;
  allBrands: Brand[] = [];

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private dialogRef: MatDialogRef<BrandModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { brand: Brand }
  ) {}

  ngOnInit(): void {
    this.brandForm = this.fb.group({
      name: [this.data.brand?.name || '', Validators.required]
    });

    this.isEditMode = !!this.data.brand;

    // Carrega todas as marcas para validação de duplicidade
    this.brandService.getBrands().subscribe({
      next: (brands) => this.allBrands = brands,
      error: (err) => console.error('Erro ao carregar marcas', err)
    });
  }

  onSubmit(): void {
    if (this.brandForm.invalid) return;

    const name = this.brandForm.value.name.trim().toLowerCase();

    const isDuplicate = this.allBrands.some(b =>
      b.name.trim().toLowerCase() === name && (!this.isEditMode || b.id !== this.data.brand?.id)
    );

    if (isDuplicate) {
      this.snackBar.open('Este nome de marca já existe!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const brand: Brand = this.brandForm.value;

    if (this.isEditMode && this.data.brand?.id) {
      brand.id = this.data.brand.id;
      this.brandService.updateBrand(brand).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Erro ao atualizar marca', error)
      });
    } else {
      this.brandService.createBrand(brand).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Erro ao criar marca', error)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
