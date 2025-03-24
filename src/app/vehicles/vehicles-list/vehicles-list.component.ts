
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VehiclesService, Vehicle } from '../vehicles.service';
import { FormsModule } from '@angular/forms';
import { VehicleModalComponent } from '../vehicle-modal/vehicle-modal.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-vehicles-list',
  standalone: true, // Define o componente como standalone
  imports: [
    CommonModule,
    MatLabel,
    FormsModule,
    MatFormField,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,  // Para matInput funcionar
    MatTableModule,
    MatDialogModule,

    VehicleModalComponent // Importe o modal se necessário
  ],

  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss']
})

export class VehiclesListComponent {
  vehicles: Vehicle[] = []; //Array que armazena a lista de veículos. Inicialmente está vazio.
  filteredVehicles: Vehicle[] = [];

  // Filtros
  filterModel: string = '';
  filterYear: string = '';
  filterMinPrice: number | null = null;
  filterMaxPrice: number | null = null;

  constructor ( //Injeta o VehiclesService para lidar com os dados dos veículos e o MatDialog para gerenciar diálogos.
    private vehiclesService: VehiclesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void { //Método do ciclo de vida executado após o componente ser inicializado.
  // Aqui, ele chama o método loadVehicles() para carregar os veículos.
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehiclesService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.filteredVehicles = [...data]; // Inicializa com todos os veículos
      },
      error: (error) => console.error("Erro ao carregar veículos", error)
    });
  }

  applyFilters(): void {
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const matchesModel = vehicle.model.toLowerCase().includes(this.filterModel.toLowerCase());
      const matchesYear = this.filterYear ? vehicle.year.toString().includes(this.filterYear) : true;
      const matchesPrice =
        (this.filterMinPrice ? vehicle.dailyPrice >= this.filterMinPrice : true) &&
        (this.filterMaxPrice ? vehicle.dailyPrice <= this.filterMaxPrice : true);

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
    const dialogRef = this.dialog.open(VehicleModalComponent, {  //this.dialog.open: Abre o modal utilizando VehicleModalComponent como conteúdo.
      width: '400px', // Define a largura do modal.
      data: { vehicle } //data: Passa os dados do veículo selecionado (ou null) ao modal.
    });

    dialogRef.afterClosed().subscribe((result) => { //afterClosed(): Executa quando o modal é fechado.
    // Caso o modal retorne um resultado positivo (indica que houve alguma alteração),
    //  o método loadVehicles() é chamado para atualizar a lista de veículos.
      if (result) {
        this.loadVehicles();
      }
    });
  }

  deleteVehicle(vehicle: Vehicle): void {
    if (confirm('Tem certeza que deseja excluir este veículo?')) { //confirm: Abre uma caixa de diálogo de confirmação antes de executar a exclusão.
      this.vehiclesService.deleteVehicle(vehicle.id).subscribe({ //vehiclesService.deleteVehicle(vehicle.id): Chama o serviço para excluir o veículo com base em seu ID.
        next: () => this.loadVehicles(), //next: Recarrega a lista de veículos ao concluir a exclusão.
        error: (error) => console.error('Erro ao excluir veículo', error) //error: Exibe um erro no console caso a operação falhe.
      });
    }
  }
}


