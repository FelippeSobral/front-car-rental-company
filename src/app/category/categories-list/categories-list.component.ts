import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService, Category } from '../categories.service';
import { CategoryModalComponent } from '../categories-modal/category-modal.compronent';
@Component({
  selector: 'app-categories-list',
  imports:[CommonModule, FormsModule, MatInputModule,MatFormFieldModule,MatIconModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm: string = '';

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = [...data];
      },
      error: (error) => console.error('Erro ao carregar categorias', error)
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
