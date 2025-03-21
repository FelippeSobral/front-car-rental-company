import {Component} from '@angular/core'
import { Form, FormControl, FormGroup , ReactiveFormsModule , Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { PrimaryInputComponent } from '../primary-input/primary-input.component'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, PrimaryInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  submit() {
    if (this.loginForm.valid) {
      console.log('Login realizado:', this.loginForm.value);
      this.router.navigate(['/dashboard']); // Redireciona para o dashboard
    } else {
      console.error('Formulário inválido');
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']); // Redireciona para a página de cadastro
  }
}

