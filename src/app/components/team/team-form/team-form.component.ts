import { Component, EventEmitter, inject, Input, Output, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ITeam , IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule, 
  ],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss'
})
export class TeamFormComponent {
  
  public fb: FormBuilder = inject(FormBuilder);
  @Input() teamForm!: FormGroup;
  @Input() teams: ITeam[] = [];
  @Input() isEditing: boolean = false;
  @Output() callSaveMethod: EventEmitter<ITeam> = new EventEmitter<ITeam>();
  @Output() callUpdateMethod: EventEmitter<ITeam> = new EventEmitter<ITeam>();

  public loggedInUserId: number = 0;
  public role: string = ''; // 'admin', 'docente', 'estudiante'
  public users = computed(() => this.userService.users$());

  constructor(private userService: UserService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.loggedInUserId = user.id || 0;
      this.role = user.role?.name?.toUpperCase() || 'GUEST';

      if (this.role === 'SUPER_ADMIN') {
        this.userService.getAllTeachers(); // Obtén los docentes
      }

      if (this.role === 'ADMIN') {
        this.teamForm.patchValue({
          teacherLeader: this.loggedInUserId,
        });
      }
    } else {
      console.error('Error: No se pudo obtener el usuario logueado desde AuthService');
    }
  }
  
  callSave() {
    const teacherLeaderId = Number(this.teamForm.controls['teacherLeader'].value);
    console.log('Tipo de teacherLeaderId:', typeof teacherLeaderId);
    console.log('Tipo de user.id:', typeof this.users()[0]?.id);
  
    const selectedTeacher = this.users().find((user) => user.id === teacherLeaderId);
  
    if (!selectedTeacher) {
      console.error('Profesor no encontrado');
      return;
    }
  
    const team: ITeam = {
      id: this.teamForm.controls['id'].value,
      name: this.teamForm.controls['name'].value,
      description: this.teamForm.controls['description'].value,
      teacherLeader: {
        id: selectedTeacher?.id || this.loggedInUserId,
        name: selectedTeacher?.name || '', 
        lastname: selectedTeacher?.lastname || '',
        email: selectedTeacher?.email || ''
      },
      avatarId: this.teamForm.controls['avatarId'].value ? Number(this.teamForm.controls['avatarId'].value) : 1,
    };
  
    console.log('Payload enviado al backend:', team);
  
    if (this.isEditing) {
      this.callUpdateMethod.emit(team); // Emitir evento para actualizar
    } else {
      this.callSaveMethod.emit(team); // Emitir evento para guardar
    }
  }
  
}