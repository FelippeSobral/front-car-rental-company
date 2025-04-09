import { EnvironmentInjector, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface Brand {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiUrl = 'http://localhost:3000/api/brands';

  constructor(private http: HttpClient) {} // Injeção do HttpClient

  // Retorna a lista de marcas
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl) // Retorna a lista de marcas como um Observable
  }

  getTotalBrands(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  // Cria uma nova marca
  createBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.apiUrl, brand)
  }

  // Atualiza uma marca existente
  updateBrand(brand: Brand): Observable<Brand> {
    return this.http.put<Brand>(`${this.apiUrl}/${brand.id}`, {name: brand.name})
  }

  // Exclui uma marca
  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
