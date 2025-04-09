import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrandService, Brand } from '../brands.service';
import { BrandModalComponent } from '../brand-modal/brand-modal.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-brands-list',
  standalone: true, // Define o componente como standalone
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule, // Corrigido para usar o mat-spinner
    BrandModalComponent,
  ],
})
export class BrandListComponent implements OnInit {
  @ViewChild('openButton') openButton!: ElementRef; // Referência ao botão que abre o modal
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  searchTerm: string = '';
  isLoading: boolean = false; // Corrigido para evitar erro

  constructor(
    private brandsService: BrandService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  // Carrega a lista de marcas
  loadBrands(): void {
    this.isLoading = true; // Inicia o carregamento
    this.brandsService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.filteredBrands = [...data];
        this.isLoading = false; // Finaliza o carregamento
      },
      error: (error) => {
        console.error('Erro ao carregar marcas', error);
        this.isLoading = false;
      },
    });
  }

  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredBrands = [...this.brands];
      return;
    }
    this.filteredBrands = this.brands.filter((brand) =>
      brand.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Abre o modal para adicionar ou editar uma marca
  openBrandModal(brand: Brand | null = null): void {
    const dialogRef = this.dialog.open(BrandModalComponent, {
      width: '400px',
      data: { brand },
    });

    // Após o fechamento do modal
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBrands(); // Recarrega a lista de marcas
      }
      this.openButton.nativeElement.focus(); // Devolve o foco ao botão que abriu o modal
    });
  }

  // Exclui uma marca
  deleteBrand(brand: Brand): void {
    if (confirm('Tem certeza que deseja excluir esta marca?')) {
      this.brandsService.deleteBrand(brand.id).subscribe({
        next: () => this.loadBrands(), // Corrigido: recarrega a lista após exclusão
        error: (error) => console.error('Erro ao excluir marca', error),
      });
    }
  }
}
