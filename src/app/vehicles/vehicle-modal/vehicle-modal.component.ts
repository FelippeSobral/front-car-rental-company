import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; //Usados para criar e validar formulários reativos.
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; //Serviços do Angular Material para gerenciar o modal e acessar os dados passados para ele.
import { VehiclesService, Vehicle } from '../vehicles.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vehicle-modal',
  standalone: true, // Define o componente como standalone
  imports: [ // Importa os módulos necessários
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule, // Importe o MatDialogModule
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './vehicle-modal.component.html',
  styleUrls: ['./vehicle-modal.component.scss']
})
export class VehicleModalComponent implements OnInit {

  vehicleForm!: FormGroup; // Um formulário reativo que captura os dados do veículo.
  isEditMode: boolean = false; //Booleano que indica se o modal está no modo de edição (verdadeiro) ou criação (falso).

  constructor (
    private fb: FormBuilder, //Facilita a criação do formulário reativo
    private vehiclesService: VehiclesService, //Para interagir com os dados do veículo (criação ou atualização).
    private dialogRef: MatDialogRef<VehicleModalComponent>, //Referência ao modal, usada para fechá-lo.
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle }) {} //Injeta os dados passados ao modal (neste caso, o veículo a ser editado ou null para criação).

    ngOnInit(): void { //Inicializa o formulário reativo com os dados do veículo (se fornecidos) ou com valores padrão.
      this.vehicleForm = this.fb.group({
        name: [this.data.vehicle?.name || '', Validators.required],
        brand: [this.data.vehicle?.brand || '', Validators.required],
        model: [this.data.vehicle?.model || '', Validators.required],
        year: [this.data.vehicle?.year || '', Validators.required] //Campos do formulário inicializados com os dados do veículo ou com strings vazias.
      }); //Validators.required: Validação que exige que o campo seja preenchido.

      this.isEditMode = !!this.data.vehicle; //isEditMode: É configurado como true se um veículo foi passado para edição.

    }

    //Validação do formulário: Verifica se os campos estão válidos antes de prosseguir.
    onSubmit(): void {
      if (this.vehicleForm.invalid) return;

      const vehicle: Vehicle = this.vehicleForm.value;
      if (this.isEditMode && this.data.vehicle?.id) {
        vehicle.id = this.data.vehicle.id;

        this.vehiclesService.updateVehicle(vehicle).subscribe({ //Atualiza o veículo usando vehiclesService.updateVehicle(vehicle).
          next: () => this.dialogRef.close(true), //Fecha o modal com this.dialogRef.close(true) se a operação for bem-sucedida.
          error: (error) => console.error('Erro ao atualizar veículo', error)
        });
      } else {
        this.vehiclesService.createVehicle(vehicle).subscribe({ //Cria um novo veículo usando vehiclesService.createVehicle(vehicle).
          next: () => this.dialogRef.close(true), //Fecha o modal de forma semelhante.
          error: (error) => console.error('Erro ao criar veículo', error) //Erros: Exibe no console caso as operações falhem
        });
      }
    }

    onCancel(): void {
      this.dialogRef.close(false); //Fecha o modal sem salvar alterações (retornando false).
    }
}
