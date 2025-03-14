import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrandFormComponent } from './brands/brands-form/brands-form.component';
import { BrandListComponent } from './brands/brands-list/brands-list.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,BrandFormComponent,BrandListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-locadora-veiculos';
}
