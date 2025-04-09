import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CreateVehicleDto } from './dto/CreateVehicleDto';

// Interface principal
// Interface principal
export interface Vehicle {
  id?: number;
  modelo: string;
  ano: number;
  preco_diaria: number;
  marcaId: number;  // Alterado de 'marca' para 'marcaId'
  categoriaId: number;  // Alterado de 'categoria' para 'categoriaId'
}



// DTO para criação (apenas IDs)


@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private apiUrl = 'http://localhost:3000/api/vehicles';

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }
  getTotalVehicles(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getRecentVehicles(limit: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/recent?limit=${limit}`);
  }


  createVehicle(vehicleData: CreateVehicleDto): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicleData).pipe(
      catchError(error => {
        console.error('Erro ao criar veículo:', error);
        return throwError(() => new Error('Erro ao criar veículo'));
      })
    );
  }

  updateVehicle(id: number, vehicleData: CreateVehicleDto): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/${id}`, vehicleData);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
