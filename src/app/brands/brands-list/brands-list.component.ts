import { Component, OnInit } from '@angular/core';
import { BrandService, Brand } from '../brands.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands-list',
  imports: [],
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.scss'
})
export class BrandListComponent  implements OnInit{
  brands: Brand[] = [];

  constructor(private brandsService: BrandService, private router: Router)  {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandsService.getBrands().subscribe(
      (data) => this.brands = data,
      (error) => console.error('Erro ao carregar marcas' , error)
    );
  }


  editBrand(id: number): void {
    this.router.navigate(['/brands/edit', id]);
  }


  deleteBrand(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta marca?')) {
      this.brandsService.deleteBrand(id).subscribe(
        () => this.loadBrands(),
        (error) => console.error('Erro ao excluir marca', error)
      );
    }
  }
}
