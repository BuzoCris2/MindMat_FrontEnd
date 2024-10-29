import { Component, inject, ViewChild } from '@angular/core';
import { CategoriesListComponent } from '../../components/categories/categories-list/categories-list.component';
import { CategoryService } from '../../services/category.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalService } from '../../services/modal.service';
import { CategoriesFormComponent } from '../../components/categories/categories-form/categories-form.component';
import { ICategory } from '../../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CategoriesListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    CategoriesFormComponent,
    CommonModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  public categoriesService: CategoryService = inject(CategoryService);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  @ViewChild('addCategoriesModal') public addCategoriesModal: any;
  public fb: FormBuilder = inject(FormBuilder);
  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
  })

  constructor() {
    this.categoriesService.search.page = 1;
    this.categoriesService.getAll();
  }

  saveCategory(category: ICategory) {
    this.categoriesService.save(category);
    this.modalService.closeAll();
  }

  callEdition(category: ICategory) {
    this.categoryForm.controls['id'].setValue(category.id ? JSON.stringify(category.id) : '');
    this.categoryForm.controls['name'].setValue(category.name ? category.name : '');
    this.categoryForm.controls['description'].setValue(category.description ? category.description : '');
    this.modalService.displayModal('md', this.addCategoriesModal);
  }
  
  updateCategory(category: ICategory) {
    this.categoriesService.update(category);
    this.modalService.closeAll();
  }

  openAddCategoryModal() {
    this.modalService.displayModal('md', this.addCategoriesModal);
  }

  public canAddCategory(): boolean {
    return this.authService.isSuperAdmin() || this.authService.hasRole('ROLE_ADMIN');
  }

}
