import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';


export interface Category {
  id: number;
  descricao: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://localhost:3000/categories'; // Ajuste a URL conforme necessário
  private categories: Category[] = [];
  private categoriesSubject = new BehaviorSubject<Category[]>(this.categories);

  constructor(private http: HttpClient) {}

  checkDuplicateCategory(descricao: string) {
    return this.http.get<boolean>(`/api/categories/check-duplicate?descricao=${descricao}`);
  }

  // Retorna todas as categorias
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap(categories => {
        this.categories = categories;
        this.categoriesSubject.next(this.categories);
      })
    );
  }

  // Retorna o total de categorias
  getTotalCategories(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);

  }

  // Retorna uma categoria pelo ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Adiciona uma nova categoria
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, { name: category.descricao }).pipe(
      tap(newCategory => {
        this.categories.push(newCategory);
        this.categoriesSubject.next(this.categories);
      })
    );
  }

  // Atualiza uma categoria existente
  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, { name: category.descricao }).pipe(
      tap(updatedCategory => {
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
          this.categoriesSubject.next(this.categories);
        }
      })
    );
  }

  // Exclui uma categoria
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.categoriesSubject.next(this.categories);
      })
    );
  }
}
