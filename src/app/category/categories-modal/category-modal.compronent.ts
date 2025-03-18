import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CategoriesService, Category } from '../categories.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  imports: [ // Importa os módulos necessários
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule, // Importe o MatDialogModule
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {
  categoryForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category: Category }
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      descricao: [this.data.category?.descricao || '', Validators.required]
    });

    this.isEditMode = !!this.data.category;
  }

  // Submete o formulário
  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    const category: Category = this.categoryForm.value;
    if (this.isEditMode && this.data.category?.id) {
      // Passa o ID e o objeto category para o método updateCategory
      this.categoriesService.updateCategory(this.data.category.id, category).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Erro ao atualizar categoria', error)
      });
    } else {
      this.categoriesService.createCategory(category).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Erro ao criar categoria', error)
      });
    }
  }
  // Cancela e fecha o modal
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
