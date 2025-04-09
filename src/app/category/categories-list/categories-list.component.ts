import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoriesService, Category } from '../categories.service';
import { CategoryModalComponent } from '../categories-modal/category-modal.compronent';
import { ErrorDialogComponent } from '../../errors/error-dialog.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ErrorDialogComponent
  ],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias', error);
        this.isLoading = false;
      }
    });
  }

  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredCategories = [...this.categories];
      return;
    }

    this.filteredCategories = this.categories.filter(category =>
      category.descricao.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openCategoryModal(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '500px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoriesService.createCategory(result).subscribe({
          next: () => this.loadCategories(),
          error: (error) => {
            if (error.error.message === 'Categoria com essa descrição já existe.') {
              alert('Já existe uma categoria com essa descrição!');
            } else {
              console.error('Erro ao criar categoria', error);
            }
          }
        });
      }
    });
  }

  deleteCategory(category: Category): void {
    if (confirm(`Tem certeza que deseja excluir a categoria "${category.descricao}"?`)) {
      this.categoriesService.deleteCategory(category.id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => {
          console.error('Erro ao excluir categoria', error);
          if (error.status === 400) {
            alert('Não é possível excluir esta categoria pois existem veículos vinculados a ela.');
          }
        }
      });
    }
  }
}
