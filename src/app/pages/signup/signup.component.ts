import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms'; // Adicione esta linha


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator() });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  submit() {
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      if (this.signupForm.hasError('mismatch')) {
        this.errorMessage = 'As senhas não coincidem';
      } else {
        this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      }
      return;
    }

    const { confirmPassword, ...userData } = this.signupForm.value;

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao cadastrar usuário';
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
