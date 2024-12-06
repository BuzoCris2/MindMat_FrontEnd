import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ITeam , IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';


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
  @Output() callSaveMethod: EventEmitter<ITeam> = new EventEmitter<ITeam>();
  @Output() callUpdateMethod: EventEmitter<ITeam> = new EventEmitter<ITeam>();

  public loggedInUserId: number = 0;
  public role: string = ''; // 'admin', 'docente', 'estudiante'
  public users: IUser[] = []; // Lista de usuarios para selección (solo admin)

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getLoggedInUser().subscribe({
      next: (user: IUser) => {
        this.loggedInUserId = user?.id || 0;
  
        if (user.role && user.role.name) {
          this.role = user.role.name.toUpperCase(); // Convierte a mayúsculas
        } else {
          this.role = 'GUEST'; // Valor por defecto
        }
  
        // Si el usuario es SUPER_ADMIN, carga lista de docentes
        if (this.role === 'SUPER_ADMIN') {
          this.userService.getAll(); // Llama a `getAll()` para llenar el signal `users$`
          const allUsers = this.userService.users$(); // Accede directamente al valor del signal
          this.users = allUsers.filter((u: IUser) => u.role?.name.toUpperCase() === 'ADMIN'); // Filtra los docentes
        }
  
        // Si el usuario es ADMIN (docente), asigna automáticamente como Teacher Leader
        if (this.role === 'ADMIN') {
          this.teamForm.patchValue({
            teacherLeader: this.loggedInUserId,
          });
        }
      },
      error: (err: any) => {
        console.error('Error al obtener el usuario logueado:', err);
      },
    });
  }  
  
  callSave() {
    const teacherLeaderId = this.teamForm.controls['teacherLeader'].value;
    const selectedTeacher = this.users.find(user => user.id === teacherLeaderId);

    const team: ITeam = {
      id: this.teamForm.controls['id'].value,
      name: this.teamForm.controls['name'].value,
      description: this.teamForm.controls['description'].value,
      teacherLeader: {
        id: selectedTeacher?.id || this.loggedInUserId,
        name: selectedTeacher?.name || '',
        lastname: selectedTeacher?.lastname || '',
        email: selectedTeacher?.email || '',
      },
      members: this.teamForm.controls['members'].value || [],
      avatarId: 1, 
    };

    console.log('Payload enviado al backend:', team);

    if (team.id) {
      this.callUpdateMethod.emit(team);
    } else {
      this.callSaveMethod.emit(team);
    }
}
  
}
