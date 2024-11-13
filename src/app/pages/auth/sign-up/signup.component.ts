import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ILoginResponse, IUser } from '../../../interfaces';
import { AlertModalComponent } from '../../../components/alert/alert-modal.component';
import { catchError, Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,AlertModalComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SigUpComponent {
  public signUpError!: string;
  public translatedSignUpError!: string;
  public emailError: string | null = null;
  public showAlert: boolean = false;
  public alertType: 'time' | 'error' | 'success' = 'success';
  public alertTitle: string = '';
  public alertMessage: string = '';
  public alertButtonText: string = 'OK';

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public user: IUser = {};
  public confirmPassword: string = '';
  public confirmPasswordTouched: boolean = false;
  public showPassword1: boolean = false;
  public showPassword2: boolean = false;
  onCloseCallback: (() => void) | undefined;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  

  public handleSignup(event: Event) {
    event.preventDefault();
    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
    }
    if (!this.lastnameModel.valid) {
      this.lastnameModel.control.markAsTouched();
    }
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.passwordModel.valid && this.passwordsMatch()) {
      this.authService.signup(this.user).subscribe({
        next: () => {
          this.triggerAlert(
            'success',
            '¡Registro exitoso!',
            'Usuario registrado con éxito. Presiona OK para iniciar sesión.',
            'OK',
            () => this.router.navigateByUrl('/login')
          );
        },
        error: (err: Error) => {
          // Usa el mensaje de error específico del servicio
          this.triggerAlert('error', '¡Error al registrarse!', err.message, 'OK');
        },
      });
    }
  }

  public passwordsMatch(): boolean {
    return this.user.password === this.confirmPassword;
  }

  public togglePasswordVisibility(fieldNumber: number) {
    if (fieldNumber === 1) {
      this.showPassword1 = !this.showPassword1;
    } else if (fieldNumber === 2) {
      this.showPassword2 = !this.showPassword2;
    }
  }
  public validateEmail() {
    if (this.user.email) {
      this.authService.checkEmailExists(this.user.email).subscribe({
        next: (exists) => {
          this.emailError = exists ? 'Correo ya utilizado' : null;
          this.emailModel.control.setErrors(exists ? { emailTaken: true } : null);
        },
        error: () => {
          this.emailError = 'Error al verificar el correo';
        }
      });
    }
  }

   public triggerAlert(type: 'time' | 'error' | 'success', title: string, message: string, buttonText: string = 'Cerrar', onCloseCallback?: () => void) {
    this.alertType = type;
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertButtonText = buttonText;
    this.showAlert = true;
    this.onCloseCallback = onCloseCallback;
  }
  
  public handleAlertClose() {
    this.showAlert = false;
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }


}
