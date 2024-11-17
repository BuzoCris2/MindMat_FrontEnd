import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ITeam } from '../../../interfaces';
import { CommonModule } from '@angular/common';

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

  callSave() {
    let team: ITeam = {
      id: this.teamForm.controls['id'].value,
      name: this.teamForm.controls['name'].value,
      description: this.teamForm.controls['description'].value,
      teacherLeader: this.teamForm.controls['teacherLeader'].value,  // Extraemos solo el ID
      members: this.teamForm.controls['members'].value
    };
  
    if (this.teamForm.controls['id'].value) {
      team.id = this.teamForm.controls['id'].value;
    }
  
    if (team.id) {
      this.callUpdateMethod.emit(team);
    } else {
      this.callSaveMethod.emit(team);
    }
  }
}
