import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule

import { MatDialog } from '@angular/material/dialog';
import { CategoriesService, Category } from '../categories.service';
import { CategoryModalComponent } from '../categories-modal/category-modal.compronent';
@Component({
  selector: 'app-categories-list',
  imports:[CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Carrega a lista de categorias
  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Erro ao carregar categorias', error)
    });
  }

  // Abre o modal para adicionar/editar uma categoria
  openCategoryModal(category: Category | null = null): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '400px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategories(); // Recarrega a lista após adicionar/editar
      }
    });
  }

  // Exclui uma categoria
  deleteCategory(category: Category): void {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.categoriesService.deleteCategory(category.id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Erro ao excluir categoria', error)
      });
    }
  }
}
