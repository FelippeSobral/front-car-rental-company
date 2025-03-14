import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';


export interface Brand {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private brands: Brand[] = [
    {id: 1, name: 'Marca A'},
    {id: 2, name: 'Marca B'},
    {id: 3, name: 'Narca C'}
  ]
  constructor() { }

  getBrands(): Observable<Brand[]> {
    return of(this.brands);
  }

  getBrand(id: number): Observable<Brand | undefined> {
    const brand = this.brands.find(b => b.id === id);
    return of(brand); // Simula uma chamada HTTP
  }

  createBrand(brand: Brand): Observable<Brand> {
    brand.id = this.brands.length + 1; // Simula a geração de um ID
    this.brands.push(brand);
    return of(brand); // Simula uma chamada HTTP
  }

  updateBrand(brand: Brand): Observable<Brand> {
    const index = this.brands.findIndex(b => b.id === brand.id);
    if (index !== -1) {
      this.brands[index] = brand;
    }
    return of(brand); // Simula uma chamada HTTP
  }

  deleteBrand(id: number): Observable<void> {
    this.brands = this.brands.filter(b => b.id !== id);
    return of(); // Simula uma chamada HTTP
  }

}
