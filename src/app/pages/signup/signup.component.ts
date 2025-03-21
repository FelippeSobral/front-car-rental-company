import {Component} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { PrimaryInputComponent } from '../primary-input/primary-input.component'

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, PrimaryInputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})

export class SignupComponent {
  signupForm: FormGroup;

  constructor(private router: Router) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    })
  }
  submit() {
    if (this.signupForm.valid) {
      console.log('Cadastro realizado:', this.signupForm.value);
      this.router.navigate(['/dashboard']); // Redireciona para o dashboard
    } else {
      console.error('Formulário inválido');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
}
