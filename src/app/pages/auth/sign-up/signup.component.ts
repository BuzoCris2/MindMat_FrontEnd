import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SigUpComponent {
  public signUpError!: string;
  public translatedSignUpError!: string;
  public showSuccessModal: boolean = false;
  public showErrorModal: boolean = false;
  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public user: IUser = {};
  public confirmPassword: string = '';
  public confirmPasswordTouched: boolean = false;
  public showPassword1: boolean = false;
  public showPassword2: boolean = false;

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
          this.showSuccessModal = true;
          setTimeout(() => {
            this.closeSuccessModal();
            this.router.navigateByUrl('/login');
          }, 3000);
        },
        error: (err: any) => {
          this.signUpError = err?.error?.description;
          this.translatedSignUpError = this.translateErrorMessage(this.signUpError);
          this.showErrorModal = true;
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

  public closeSuccessModal() {
    this.showSuccessModal = false;
  }

  public closeErrorModal() {
    this.showErrorModal = false;
  }

  private translateErrorMessage(errorMessage: string): string {
      return 'Ha ocurrido un error. Por favor, intenta de nuevo.';
  }
}
