import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrandService, Brand } from '../brands.service';

@Component({
  selector: 'app-brand-modal',
  standalone: true, // Define o componente como standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './brand-modal.component.html',
  styleUrls: ['./brand-modal.component.scss']
})
export class BrandModalComponent implements OnInit {
  brandForm!: FormGroup; // Usando o operador ! para indicar que será inicializado posteriormente
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private dialogRef: MatDialogRef<BrandModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { brand: Brand }
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário no ngOnInit
    this.brandForm = this.fb.group({
      name: [this.data.brand?.name || '', Validators.required]
    });

    this.isEditMode = !!this.data.brand; // Define o modo de edição
  }

  // Submete o formulário
  onSubmit(): void {
    if (this.brandForm.invalid) return;

    const brand: Brand = this.brandForm.value;
    if (this.isEditMode && this.data.brand?.id) {
      brand.id = this.data.brand.id;
      this.brandService.updateBrand(brand).subscribe({
        next: () => this.dialogRef.close(true), // Fecha o modal e retorna true
        error: (error) => console.error('Erro ao atualizar marca', error)
      });
    } else {
      this.brandService.createBrand(brand).subscribe({
        next: () => this.dialogRef.close(true), // Fecha o modal e retorna true
        error: (error) => console.error('Erro ao criar marca', error)
      });
    }
  }

  // Cancela e fecha o modal
  onCancel(): void {
    this.dialogRef.close(false); // Fecha o modal e retorna false
  }
}
