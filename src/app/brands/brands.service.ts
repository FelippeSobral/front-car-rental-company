import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Brand {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private brands: Brand[] = []; // Inicializa a lista de marcas
  private brandsSubject = new BehaviorSubject<Brand[]>(this.brands); // Torna a lista de marcas reativa

  constructor() {}

  // Retorna a lista de marcas
  getBrands(): Observable<Brand[]> {
    return of(this.brands); // Retorna a lista de marcas como um Observable
  }

  // Cria uma nova marca
  createBrand(brand: Brand): Observable<Brand> {
    brand.id = this.brands.length + 1; // Gera um novo ID
    this.brands.push(brand); // Adiciona a marca ao array
    return of(brand); // Retorna a marca criada
  }

  // Atualiza uma marca existente
  updateBrand(brand: Brand): Observable<Brand> {
    const index = this.brands.findIndex(b => b.id === brand.id);
    if (index !== -1) {
      this.brands[index] = brand; // Atualiza a marca no array
    }
    return of(brand); // Retorna a marca atualizada
  }

  // Exclui uma marca
  deleteBrand(id: number): Observable<void> {
        // Remove a marca do array

    this.brands = this.brands.filter(b => b.id !== id);
    this.brandsSubject.next(this.brands); // Notifica os observadores
    // Remove a marca do array
    return of(); // Retorna um Observable vazio
  }
}
