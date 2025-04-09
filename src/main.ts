import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptorService } from './app/shared/services/auth.interceptor.service';
import { authInterceptor } from './app/auth.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]) // Configura HTTP client com interceptor
    ),
    provideAnimations(), // Necessário para alguns componentes do Material

    provideRouter(routes), // Configura as rotas
    provideAnimations(),   // Necessário para ngx-toastr
    provideToastr(),       // Configuração do Toastr
  ]
}).catch(err => console.error(err));
