import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  isError = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.message = 'Correo enviado con instrucciones para recuperar tu contraseña';
          this.isError = false;
          setTimeout(() => {
            this.message = '';
            this.router.navigate(['/login']); 
          }, 5000);
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.message = 'Correo no registrado';
        } else {
          this.message = 'Error al enviar el correo de recuperación, intentalo de nuevo.';
        }
        this.isError = true;
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
