import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true, // Componente standalone
  imports: [CommonModule , RouterOutlet, NavbarComponent], // Importa o RouterOutlet
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'front-locadora-veiculos';
  showNavbar: boolean = true; // Controla a exibição do navbar

  constructor(private router: Router) {
    // Verifica a rota atual para decidir se o navbar deve ser exibido
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.showNavbar = !['/login', '/signup'].includes(currentRoute);
    });
  }
}
