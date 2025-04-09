import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vehicle, VehiclesService } from '../vehicles.service';
import { Brand, BrandService } from '../../brands/brands.service';
import { Category, CategoriesService } from '../../category/categories.service';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { CreateVehicleDto } from '../dto/CreateVehicleDto';


@Component({
  selector: 'app-vehicle-modal',
  imports: [
    MatIcon,
    CommonModule,
    MatProgressBarModule,
    FormsModule,
    MatDialogModule,          // Adicionado para mat-dialog-content e mat-dialog-actions

    MatProgressSpinnerModule, // Adicionado para o mat-progress-bar
    MatTableModule,       // Adicionado para o mat-table
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './vehicle-modal.component.html',
  styleUrls: ['./vehicle-modal.component.scss']
})
export class VehicleModalComponent implements OnInit {
  currentYear = new Date().getFullYear();
  vehicleForm: FormGroup;
  isEditMode = false;
  brands: Brand[] = [];
  categories: Category[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private vehiclesService: VehiclesService,
    private brandService: BrandService,
    private categoryService: CategoriesService,
    private dialogRef: MatDialogRef<VehicleModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle }
  ) {
    this.vehicleForm = this.fb.group({
      modelo: ['', [Validators.required, Validators.maxLength(50)]],
      ano: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(this.currentYear),
        Validators.pattern('^[0-9]*$')
      ]],
      preco_diaria: ['', [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      marcaId: ['', Validators.required],
      categoriaId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();

    if (this.data?.vehicle) {
      this.isEditMode = true;
      this.patchFormValues();
    }
  }

  private patchFormValues(): void {
    const vehicle = this.data.vehicle;
    this.vehicleForm.patchValue({
      modelo: vehicle.modelo,
      ano: vehicle.ano,
      preco_diaria: vehicle.preco_diaria,
      marcaId: this.getMarcaId(vehicle),
      categoriaId: this.getCategoriaId(vehicle)
    });
  }

  private getMarcaId(vehicle: Vehicle): number {
    return vehicle.marcaId ? vehicle.marcaId : vehicle.marcaId;
  }

  private getCategoriaId(vehicle: Vehicle): number {
    return vehicle.categoriaId ? vehicle.categoriaId : vehicle.categoriaId;
  }

  loadBrands(): void {
    this.isLoading = true;
    this.brandService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        if (this.isEditMode && !brands.some(b => b.id === this.getMarcaId(this.data.vehicle))) {
          // Se a marca não existir mais, adiciona uma opção temporária
          this.brands.push({
            id: this.getMarcaId(this.data.vehicle),
            name: 'Marca não encontrada'
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao carregar marcas');
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (this.isEditMode && !categories.some(c => c.id === this.getCategoriaId(this.data.vehicle))) {
          // Se a categoria não existir mais, adiciona uma opção temporária
          this.categories.push({
            id: this.getCategoriaId(this.data.vehicle),
            descricao: 'Categoria não encontrada'
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao carregar categorias');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      this.showError('Por favor, preencha todos os campos corretamente');
      return;
    }

    this.isLoading = true;
    const formData = this.vehicleForm.value;

    const vehicleData: CreateVehicleDto = {
      modelo: formData.modelo,
      ano: Number(formData.ano),
      preco_diaria: Number(formData.preco_diaria),
      marcaId: Number(formData.marcaId),
      categoriaId: Number(formData.categoriaId)
    };

    console.log('Enviando dados:', vehicleData); // Para debug

    const operation = this.isEditMode
      ? this.vehiclesService.updateVehicle(this.data.vehicle.id!, vehicleData)
      : this.vehiclesService.createVehicle(vehicleData);

    operation.subscribe({
      next: () => {
        this.snackBar.open('Veículo salvo com sucesso!', 'Fechar', { duration: 3000 });
        console.log("carregado")
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Erro completo:', error);
        const errorMessage = error.error?.message ||
                            error.message ||
                            'Erro ao salvar veículo. Verifique os dados e tente novamente.';
        this.showError(errorMessage);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // Métodos auxiliares para validação no template
  get modelo() { return this.vehicleForm.get('modelo'); }
  get ano() { return this.vehicleForm.get('ano'); }
  get preco_diaria() { return this.vehicleForm.get('preco_diaria'); }
  get marcaId() { return this.vehicleForm.get('marcaId'); }
  get categoriaId() { return this.vehicleForm.get('categoriaId'); }
}
