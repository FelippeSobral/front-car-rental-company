import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrandService, Brand } from '../brands.service';
import { BrandModalComponent } from '../brand-modal/brand-modal.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-brands-list',
  standalone: true, // Define o componente como standalone
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.scss',
  imports: [CommonModule, BrandModalComponent ,  MatButtonModule, MatTableModule], // Importa os módulos necessários
})
export class BrandListComponent implements OnInit {
  @ViewChild('openButton') openButton!: ElementRef; // Referência ao botão que abre o modal
  brands: Brand[] = [];

  constructor(
    private brandsService: BrandService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  // Carrega a lista de marcas
  loadBrands(): void {
    console.log('Recarregando lista de marcas...'); // Debug
    this.brandsService.getBrands().subscribe({
      next: (data) => this.brands = data, // Atualiza a lista de marcas no componente
      error: (error) => console.error('Erro ao carregar marcas', error)
    });
  }

  // Abre o modal para adicionar ou editar uma marca
  openBrandModal(brand: Brand | null = null): void {
    const dialogRef = this.dialog.open(BrandModalComponent, {
      width: '400px',
      data: { brand }
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
        next: () => console.log('Marca excluída com sucesso!'),
           // Recarrega a lista após a exclusão
        error: (error) => console.error('Erro ao excluir marca', error)
      });
    }
  }
}
