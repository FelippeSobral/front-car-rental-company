import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CategoriesService } from '../category/categories.service';
import { BrandService } from '../brands/brands.service';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
totalVehicles: number = 0;
totalBrands: number = 0;
totalCategories: number = 0;
recentVehicles: any[] = []

constructor (
  private vehiclesService: VehiclesService,
  private brandsService: BrandService,
  private categoriesService: CategoriesService
){}

ngOnInit(): void{
  this.loadDashboardData();
}

loadDashboardData(): void {
  // Carrega o total de veículos
  this.vehiclesService.getTotalVehicles().subscribe({
    next: (total) => this.totalVehicles = total,
    error: (error) => console.error('Erro ao carregar total de veículos', error)
  })

  // Carrega o total de marcas
  this.brandsService.getTotalBrands().subscribe({
    next: (total) => this.totalBrands = total,
    error: (error) => console.error('Erro ao carregar total de marcas', error)
  })

  // Carrega o total de categorias
  this.categoriesService.getTotalCategories().subscribe({
    next: (total) => this.totalCategories = total,
    error: (error) => console.error('Erro ao carregar total de categorias', error)
  })

  // Carrega os veículos mais recentes
  this.vehiclesService.getRecentVehicles(5).subscribe({
    next: (vehicles) => this.recentVehicles = vehicles,
    error: (error) => console.error('Erro ao carregar veículos recentes', error)
  })
 }
}
