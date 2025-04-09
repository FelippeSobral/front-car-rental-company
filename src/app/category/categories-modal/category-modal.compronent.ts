import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CategoriesService, Category } from '../categories.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ErrorDialogComponent } from '../../errors/error-dialog.component';

import { of } from 'rxjs';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  imports: [ // Importa os módulos necessários
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule, // Importe o MatDialogModule
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ErrorDialogComponent
  ],
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {
  categoryForm!: FormGroup;
  isEditMode: boolean = false;
  isDuplicate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private dialogRef: MatDialogRef<CategoryModalComponent>,
    private dialog: MatDialog, // ✅ Adicione esta linha

    @Inject(MAT_DIALOG_DATA) public data: { category: Category }
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      descricao: [
        this.data.category?.descricao || '',
        [
          Validators.required,
          Validators.minLength(3), // Mínimo de 3 caracteres
          Validators.maxLength(100), // Máximo de 100 caracteres
          Validators.pattern(/^[^\s].*[^\s]$/) // Impede espaços em branco no início e fim
        ]
      ]
    });

    this.isEditMode = !!this.data.category;

    // Verifica se a categoria já existe
    this.categoryForm.get('descricao')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => {
          if (value.trim().length < 3) {
            return of(false);
          }
          return this.categoriesService.checkDuplicateCategory(value);
        })
      )
      .subscribe(exists => {
        this.isDuplicate = exists;
      });
  }

  // Submete o formulário
  onSubmit(): void {
    if (this.categoryForm.invalid || this.isDuplicate) return;

    const category: Category = {
      id: this.isEditMode ? this.data.category?.id : 0,
      descricao: this.categoryForm.value.descricao
    };

    if (this.isEditMode && this.data.category?.id) {
      this.categoriesService.updateCategory(this.data.category.id, category).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => {
          console.error('Erro ao atualizar categoria', error);
          this.dialog.open(ErrorDialogComponent, {
            data: { message: 'Erro ao atualizar a categoria.' }
          });
        }
      });
    } else {
      this.categoriesService.createCategory(category).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => {
          if (error.status === 400 && error.error.message === 'Categoria com essa descrição já existe.') {
            this.dialog.open(ErrorDialogComponent, {
              data: { message: 'Já existe uma categoria com essa descrição.' }
            });
          } else {
            console.error('Erro ao criar categoria', error);
            this.dialog.open(ErrorDialogComponent, {
              data: { message: 'Erro ao criar a categoria.' }
            });
          }
        }
      });
    }
  }


  // Cancela e fecha o modal
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
