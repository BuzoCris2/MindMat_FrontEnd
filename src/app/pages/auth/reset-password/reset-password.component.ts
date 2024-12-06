import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  token: string | null = null;
  message = '';
  isError = false;
  confirmPasswordTouched = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit() {
    if (this.newPassword === this.confirmPassword && this.token) {
      this.authService.resetPassword(this.token, this.newPassword).subscribe({
        next: (response) => {
          console.log('Response:', response);
          this.message = 'Contraseña actualizada correctamente. Espera mientras se carga la pantalla de inicio de sesión.';
          this.isError = false;
          setTimeout(() => {
            this.message = '';
            this.router.navigate(['/login']);
          }, 500);
        },
        error: (err) => {
          console.log('Error:', err);
          this.message = 'Hubo un error al actualizar la contraseña';
          this.isError = true;
        },
      });
    } else {
      this.message = 'Las contraseñas no coinciden';
      this.isError = true;
    }
  }

  togglePasswordVisibility(fieldNumber: number) {
    if (fieldNumber === 1) {
      this.showNewPassword = !this.showNewPassword;
    } else if (fieldNumber === 2) {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
