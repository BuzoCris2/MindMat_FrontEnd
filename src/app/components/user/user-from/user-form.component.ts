import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IUser, IFeedbackStatus } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule, 
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() userForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callPatchMethod: EventEmitter<IUser> = new EventEmitter();

  callSave() {
    let user: IUser = {
      email: this.userForm.controls['email'].value,
      name: this.userForm.controls['name'].value,
      lastname: this.userForm.controls['lastname'].value,
      password: this.userForm.controls['password'].value,
      updatedAt: this.userForm.controls['updatedAt'].value,
      active: this.userForm.controls['active'].value,
      avatarId : this.userForm.controls['avatarId'].value,
      role: this.userForm.controls['role'].value
    }
    if(this.userForm.controls['id'].value) {
      user.id = this.userForm.controls['id'].value;
    } 
    if(user.id) {
      this.callUpdateMethod.emit(user);
    } else {
      this.callSaveMethod.emit(user);
    }
  }

  callPatch() {
    const user: IUser = {
      id: this.userForm.controls['id'].value,
      active: this.userForm.controls['active'].value === 'true',
    };
    this.callPatchMethod.emit(user);
  }
}
