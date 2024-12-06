import { TeamService } from './../../services/team.service';
import { Component, inject, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ITeam, IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarSelectorComponent } from '../../components/user/avatar-selector/avatar-selector.component';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { Router, RouterLink } from '@angular/router';
import { AlertModalComponent } from '../../components/alert/alert-modal.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    AvatarSelectorComponent,
    AlertModalComponent,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() teams: ITeam[] = [];
  public teamService: TeamService = inject(TeamService);
  

  user: IUser | null = null;
  editingField: keyof IUser | null = null;
  originalValue?: string;
  showAvatarSelector = false;

  showAlert = false;
  alertType: 'time' | 'error' | 'success' = 'success';
  alertTitle = '¡Éxito!';
  alertMessage = 'Campo avatarId actualizado con éxito';
  alertButtonText = 'Cerrar';

  @ViewChild('avatarSelectorModal') public avatarSelectorModal: any;

  constructor(
    public profileService: ProfileService,
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router,
    
  ) {}

  ngOnInit() {
    this.profileService.getUserInfoSignal();
    this.teamService.getCountByTeacher();
    this.profileService.user$.subscribe(userData => {
      this.user = userData;
      console.log("Usuario en el componente actualizado:", this.user);
    });
  }

  getAvatarUrl(): string {
    return this.user?.avatarId ? `assets/img/avatars/avatar${this.user.avatarId}.png` : 'assets/img/avatars/default.png';
  }

  public trackById(index: number, item: ITeam): number {
    return item.id || 0;
  }

  editAvatar() {
    this.modalService.displayModal('md', this.avatarSelectorModal);
  }

  onAvatarSelected(newAvatarId: number) {
    if (this.user) {
      this.user.avatarId = newAvatarId;
      this.profileService.updateUserField('avatarId', newAvatarId.toString()).subscribe({
        next: () => {
          this.triggerAlert('success', '¡Éxito!', 'El avatar ha sido actualizado correctamente.', 'Continuar');
          this.closeAvatarSelector();
        },
        error: (error: any) => {
          this.triggerAlert('error', 'Error', `Hubo un problema al actualizar el avatar: ${error.message}`);
        }
      });
    }
  }
  
  closeAvatarSelector() {
    this.modalService.closeAll();
  }

  enableEdit(field: keyof IUser) {
    if (this.user) {
      this.editingField = field;
      this.originalValue = this.user[field] as string | undefined;
    }
  }

  saveField(field: keyof IUser, newValue: string) {
    if (this.user) {
      (this.user as Partial<IUser>)[field as keyof IUser] = newValue as any;
  
      this.profileService.updateUserField(field, newValue).subscribe({
        next: () => {
          this.triggerAlert('success', '¡Éxito!', `Tu información ha sido actualizada correctamente.`,'Continuar');

          if (field === 'email') {
            setTimeout(() => {
              this.authService.logout();
              this.router.navigate(['/main']);
            }, 4000);
          }
        },
        error: (error) => {
          this.triggerAlert('error', 'Error', `No se pudo actualizar el campo ${field}. ${error.message}`);
        }
      });
      this.editingField = null;
      this.originalValue = undefined;
    }
  }
  
  
  confirmEdit(field: keyof IUser) {
    if (this.user) {
      this.profileService.updateUserField(field, this.user[field] as string);
      this.editingField = null;
      this.originalValue = undefined;
    }
  }

  cancelEdit() {
    if (this.user && this.editingField) {
        (this.user as any)[this.editingField] = this.originalValue ?? '';

        this.editingField = null;
        this.originalValue = undefined;
    }
  }

  triggerAlert(type: 'time' | 'error' | 'success', title: string, message: string, buttonText: string = 'Cerrar') {
    this.alertType = type;
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertButtonText = buttonText;
    this.showAlert = true;
  }

  closeAlertModal() {
    this.showAlert = false;
  }

  public shouldDisplayRoute(route: 'teams'): boolean {
    const routesAvailableForUser = {
      'teams': true
    };
    return routesAvailableForUser[route];
  }
}
