import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable , of } from 'rxjs';

//Interface que define a estrutura de um veiculo
export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
}
@Injectable({
  providedIn: 'root'
})

export class VehiclesService {
  private vehicles: Vehicle[] = []; // Lista de veículos (inicialmente vazia)
  private vehiclesSubject = new BehaviorSubject<Vehicle[]>(this.vehicles) // Torna a lista reativa
  constructor() { }


  getTotalVehicles(): Observable<number> {
    return of (this.vehicles.length); // Retorna o total de veículos
  }

  getRecentVehicles(limit: number): Observable<Vehicle[]> {
  const recentVehicles = this.vehicles
    .sort((a, b) => b.id - a.id) // Ordena por ID decrescente (mais recentes primeiro)
    .slice(0, limit); // Limita a quantidade de veículos
  return of(recentVehicles);
}

  // Retorna a lista de veículos como um Observable
  getVehicles(): Observable<Vehicle[]> {
    return this.vehiclesSubject.asObservable();
  }

  //Adicione um Veiculo
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    vehicle.id = this.vehicles.length + 1; // Gera um novo ID
    this.vehicles.push(vehicle); // Adiciona o veículo à lista
    this.vehiclesSubject.next(this.vehicles); // Notifica os observadores
    return of(vehicle); // Retorna o veículo criado
  }

  //Atualizar veiculo existente
  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const index = this.vehicles.findIndex(V => V.id === vehicle.id)
    if(index !== -1) {
      this.vehicles[index] = vehicle; // Atualiza o veículo na lista
      this.vehiclesSubject.next(this.vehicles); // Notifica os observadores
    }
    return of(vehicle);
  }

  // Exclui um veiculo
  deleteVehicle(id: number): Observable<void> {
    this.vehicles = this.vehicles.filter(v => v.id !== id);// Remove o veículo da lista
    this.vehiclesSubject.next(this.vehicles);// Notifica os observadores
    return of(); // Retorna um Observable vazio
  }





}
