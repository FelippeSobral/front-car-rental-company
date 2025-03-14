import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService, Brand } from '../brands.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss']
})
export class BrandFormComponent implements OnInit {
  brandForm: FormGroup;
  isEditMode = false;
  brandId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private brandsService: BrandService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.brandId = id ? +id : null;

    if (this.brandId) {
      this.isEditMode = true;
      this.brandsService.getBrand(this.brandId).subscribe(
        (brand) => {
          if (brand) {
            this.brandForm.patchValue(brand);
          } else {
            console.error('Marca não encontrada');
          }
        },
        (error) => console.error('Erro ao carregar marca', error)
      );
    }
  }

  onSubmit(): void {
    if (this.brandForm.invalid) return;

    const brand: Brand = this.brandForm.value;
    if (this.isEditMode && this.brandId) {
      brand.id = this.brandId;
      this.brandsService.updateBrand(brand).subscribe(
        () => {
          this.snackBar.open('Marca atualizada com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/brands']);
        },
        (error) => {
          this.snackBar.open('Erro ao atualizar marca', 'Fechar', { duration: 3000 });
          console.error('Erro ao atualizar marca', error);
        }
      );
    } else {
      this.brandsService.createBrand(brand).subscribe(
        () => {
          this.snackBar.open('Marca criada com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/brands']);
        },
        (error) => {
          this.snackBar.open('Erro ao criar marca', 'Fechar', { duration: 3000 });
          console.error('Erro ao criar marca', error);
        }
      );
    }
  }
}









