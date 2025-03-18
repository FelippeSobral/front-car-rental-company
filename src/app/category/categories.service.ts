import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable , of} from 'rxjs';

export interface Category {
  id: number;
  descricao: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
private categories: Category[] = [];

private categoriesSubject = new BehaviorSubject<Category[]>(this.categories);

constructor() { }

// Retorna todas as categorias
getCategories(): Observable<Category[]> {
  return this.categoriesSubject.asObservable();
}

// Retorna uma categoria pelo ID
getCategoryById(id: number): Observable<Category | undefined> {
  const category = this.categories.find(c => c.id === id);
  return of(category);
}

// Adiciona uma nova categoria
createCategory(category: Category): Observable<Category> {
  category.id = this.categories.length + 1;
  this.categories.push(category);
  this.categoriesSubject.next(this.categories);
  return of (category);
}

//Atualiza uma categoria existente
updateCategory(id: number, category: Category): Observable<Category> {
  const index = this.categories.findIndex(c => c.id === id);
  if(index !== -1){
    this.categories[index] = category;
    this.categoriesSubject.next(this.categories); // Notifica os observadores
  }

  return of(category)
}

//Exclui uma categoria
deleteCategory(id: number): Observable<void> {
  this.categories = this.categories.filter(c => c.id  !== id);
  this.categoriesSubject.next(this.categories);
  return of();
 }
}
