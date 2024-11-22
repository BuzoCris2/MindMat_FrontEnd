import { Component, inject, ViewChild } from '@angular/core';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { UserFormComponent } from '../../components/user/user-from/user-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../../interfaces';
import { CategoriesFormComponent } from '../../components/categories/categories-form/categories-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserListComponent,PaginationComponent,ModalComponent,LoaderComponent,UserFormComponent,CategoriesFormComponent,CommonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  public userService: UserService = inject(UserService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addUsersModal') public addUsersModal: any;
  public fb: FormBuilder = inject(FormBuilder);
  userForm = this.fb.group({
    id: [''],
    email: ['', [Validators.required, Validators.email]],  // Cambiar a un array
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    password: ['', Validators.required],
    updatedAt: ['', Validators.required],
    active: ['', Validators.required],
    avatarId: ['', Validators.required],
    role: ['', Validators.required]
  });
  
  
  constructor() {
    this.userService.search.page = 1;
    this.userService.getAll();
  }

  saveUser(user: IUser) {
    this.userService.save(user);
    this.modalService.closeAll();
  }

  callEdition(user: IUser) {
    this.userForm.controls['id'].setValue(user.id ? String(user.id) : '');
    this.userForm.controls['email'].setValue(user.email || '');
    this.userForm.controls['name'].setValue(user.name || '');
    this.userForm.controls['lastname'].setValue(user.lastname || '');
    this.userForm.controls['password'].setValue(user.password || '');
    this.userForm.controls['active'].setValue(user.active ? String(user.active) : '');
    this.userForm.controls['avatarId'].setValue(user.avatarId ? String(user.avatarId) : '');
    this.userForm.controls['role'].setValue(user.role ? user.role.name : '');
    this.modalService.displayModal('md', this.addUsersModal);
  }

  openAddCategoryModal() {
    this.modalService.displayModal('md', this.addUsersModal);
  }

  updateUser(user: IUser) {
    this.userService.update(user);
    this.modalService.closeAll();
  }
  
}
