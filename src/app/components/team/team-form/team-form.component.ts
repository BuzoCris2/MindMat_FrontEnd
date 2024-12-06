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

    this.userService.getLoggedInUser().subscribe((user: IUser) => {
      this.loggedInUserId = user?.id || 0;
    
      // Verificar si el rol está definido
      if (user.role && user.role.name) {
        this.role = user.role.name.toLowerCase(); // Convertir a minúsculas
      } else {
        this.role = 'guest'; // Valor por defecto
      }
    
      // Si el usuario es admin, cargar lista de usuarios (docentes)
      if (this.role === 'admin') {
        this.userService.getAll().subscribe({
          next: (users: IUser[]) => {
            this.users = users.filter((u) => {
              return u.role && u.role.name.toLowerCase() === 'teacher';
            });
          },
          error: (err: any) => console.error('Error fetching users:', err),
        });
      }
    
      // Si el usuario es docente, asignar automáticamente como Teacher Leader
      if (this.role === 'teacher') {
        this.teamForm.patchValue({
          teacherLeader: this.loggedInUserId,
        });
      }
    });
           
  }
  
  callSave() {
    const team: ITeam = {
      id: this.teamForm.controls['id'].value,
      name: this.teamForm.controls['name'].value,
      description: this.teamForm.controls['description'].value,
      teacherLeader: {
        id: this.role === 'teacher' ? this.loggedInUserId : this.teamForm.controls['teacherLeader'].value,
        name: '', 
        lastname: '', 
        email: '',
        teamCount: 0, 
      },
      members: this.teamForm.controls['members'].value || [],
      avatarId: 1, 
    };
  

    

    
    if (team.id) {
      this.callUpdateMethod.emit(team);
    } else {
      this.callSaveMethod.emit(team);
    }
  }

  
}
