import { IsString, IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  modelo: string;

  @IsInt()
  ano: number;

  @IsNumber()
  @IsPositive()
  preco_diaria: number;

  @IsInt()
  @IsPositive()
  marcaId: number;

  @IsInt()
  @IsPositive()
  categoriaId: number;
  constructor(modelo: string, ano: number, preco_diaria: number, marcaId: number, categoriaId: number) {
    this.modelo = modelo;
    this.ano = ano;
    this.preco_diaria = preco_diaria;
    this.marcaId = marcaId;
    this.categoriaId = categoriaId;
  }
}
