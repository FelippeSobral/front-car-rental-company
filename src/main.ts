import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Configura as rotas
    provideAnimations(),   // Necessário para ngx-toastr
    provideToastr(),       // Configuração do Toastr
  ]
}).catch(err => console.error(err));
