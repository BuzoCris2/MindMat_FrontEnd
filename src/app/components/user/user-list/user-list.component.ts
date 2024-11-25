import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { UserFormComponent } from '../user-from/user-form.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  @Input() title: string = '';
  @Input() users: IUser[] = [];
  @Output() callModalAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callDeleteAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callStatusChange: EventEmitter<IUser> = new EventEmitter<IUser>();

  public trackById(index: number, item: IUser): number {
    return item.id || 0;
  }

  onStatusChange(user: IUser) {
    this.callStatusChange.emit(user);  // Emitimos el usuario al padre
  }
  
}
