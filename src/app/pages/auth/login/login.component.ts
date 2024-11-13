import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertModalComponent } from '../../../components/alert/alert-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AlertModalComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginError!: string;
  public translatedLoginError!: string;
  public showAlert: boolean = false;
  public alertType: 'time' | 'error' | 'success' = 'error';
  public alertTitle: string = '';
  public alertMessage: string = '';
  public alertButtonText: string = 'OK';

  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  public showPassword1: boolean = false;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public handleLogin(event: Event) {
    event.preventDefault();
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: () => {
          this.triggerAlert('success', '¡Éxito!', 'Inicio de sesión exitoso', 'Continuar');
          this.router.navigateByUrl('/app/user-dashboard');
        },
        error: (err: any) => {
          this.loginError = err?.error?.description;
          this.translatedLoginError = this.translateErrorMessage(this.loginError);
          this.triggerAlert('error', '¡Error al iniciar sesión!', this.translatedLoginError, 'OK');
        },
      });
    }
  }

  private translateErrorMessage(errorMessage: string): string {
    return 'Credenciales inválidas. Verifica tu correo electrónico y la contraseña.';
  }

  public togglePasswordVisibility(fieldNumber: number) {
    if (fieldNumber === 1) {
      this.showPassword1 = !this.showPassword1;
    }
  }

  public triggerAlert(type: 'time' | 'error' | 'success', title: string, message: string, buttonText: string = 'Cerrar') {
    this.alertType = type;
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertButtonText = buttonText;
    this.showAlert = true;
  }

  public closeAlertModal() {
    this.showAlert = false;
  }
}
