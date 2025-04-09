import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vehicle, VehiclesService } from '../vehicles.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleModalComponent } from '../vehicle-modal/vehicle-modal.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-vehicles-list',
  imports:[
    MatIcon,
    CommonModule,
    MatProgressBarModule,
    FormsModule,
    MatProgressSpinnerModule, // Adicionado para o mat-progress-bar
    MatTableModule,       // Adicionado para o mat-table
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,

  ],
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss']
})
export class VehiclesListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  isLoading = false;

  filterModel: string = '';
  filterYear: string = '';
  filterMinPrice: number | null = null;
  filterMaxPrice: number | null = null;

  constructor(
    private vehiclesService: VehiclesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading = true;
    this.vehiclesService.getVehicles().subscribe({
        next: (data) => {
            console.log('Dados recebidos:', data); // Adicione esta linha
            this.vehicles = data;
            this.filteredVehicles = [...data];
            this.isLoading = false;
        },
        error: (error) => {
            console.error('Erro ao carregar veículos', error);
            this.isLoading = false;
            this.snackBar.open('Erro ao carregar veículos', 'Fechar', { duration: 3000 });
        }
    });
}

  applyFilters(): void {
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const matchesModel = vehicle.modelo.toLowerCase().includes(this.filterModel.toLowerCase());
      const matchesYear = this.filterYear ? vehicle.ano.toString().includes(this.filterYear) : true;
      const matchesPrice =
        (this.filterMinPrice ? vehicle.preco_diaria >= this.filterMinPrice : true) &&
        (this.filterMaxPrice ? vehicle.preco_diaria <= this.filterMaxPrice : true);

      return matchesModel && matchesYear && matchesPrice;
    });
  }

  clearFilters(): void {
    this.filterModel = '';
    this.filterYear = '';
    this.filterMinPrice = null;
    this.filterMaxPrice = null;
    this.filteredVehicles = [...this.vehicles];
  }

  openVehicleModal(vehicle: Vehicle | null = null): void {
    const dialogRef = this.dialog.open(VehicleModalComponent, {
      width: '600px',
      data: { vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVehicles();
      }
    });
  }

  deleteVehicle(vehicle: Vehicle): void {
    if (!vehicle.id) {
      console.error('ID do veículo não está definido');
      this.snackBar.open('Erro: ID do veículo inválido', 'Fechar', { duration: 3000 });
      return;
    }

    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      this.vehiclesService.deleteVehicle(vehicle.id).subscribe({
        next: () => {
          this.loadVehicles();
          this.snackBar.open('Veículo excluído com sucesso', 'Fechar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Erro ao excluir veículo', error);
          this.snackBar.open('Erro ao excluir veículo', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}
