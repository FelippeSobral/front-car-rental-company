import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CategoriesService } from '../category/categories.service';
import { BrandService } from '../brands/brands.service';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalVehicles: number = 0;
  totalBrands: number = 0;
  totalCategories: number = 0;
  recentVehicles: any[] = [];
  isLoading: boolean = true;
  lastUpdated: Date = new Date();
  displayedColumns: string[] = ['modelo', 'marca', 'categoria', 'ano'];

  constructor(
    private vehiclesService: VehiclesService,
    private brandsService: BrandService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      vehicles: this.vehiclesService.getTotalVehicles(),
      brands: this.brandsService.getTotalBrands(),
      categories: this.categoriesService.getTotalCategories(),
      recent: this.vehiclesService.getRecentVehicles(5)
    }).subscribe({
      next: (results) => {
        console.log('Dados recebidos:', results.recent); // Adicione esta linha

        this.totalVehicles = results.vehicles;
        this.totalBrands = results.brands;
        this.totalCategories = results.categories;
        this.recentVehicles = results.recent;
        this.lastUpdated = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
