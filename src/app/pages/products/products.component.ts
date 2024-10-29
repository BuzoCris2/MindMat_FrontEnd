import { Component, inject, ViewChild } from '@angular/core';
import { ProductsListComponent } from '../../components/products/products-list/products-list.component';
import { ProductService } from '../../services/product.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalService } from '../../services/modal.service';
import { ProductsFormComponent } from '../../components/products/products-form/products-form.component';
import { IProduct, ICategory } from '../../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductsListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    ProductsFormComponent,
    CommonModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  public productsService: ProductService = inject(ProductService);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public categoriesService: CategoryService = inject(CategoryService);
  
  public categories: ICategory[] = [];

  @ViewChild('addProductsModal') public addProductsModal: any;
  public fb: FormBuilder = inject(FormBuilder);
  productForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    stockQuantity: ['', Validators.required],
    categoryId: ['', Validators.required],
  })

  constructor() {
    this.productsService.search.page = 1;
    this.productsService.getAll();
    this.categoriesService.getAll();
  }

  saveProduct(product: IProduct) {
    this.productsService.save(product);
    this.modalService.closeAll();
  }

  callEdition(product: IProduct) {
    this.productForm.controls['id'].setValue(product.id ? JSON.stringify(product.id) : '');
    this.productForm.controls['name'].setValue(product.name ? product.name : '');
    this.productForm.controls['description'].setValue(product.description ? product.description : '');
    this.productForm.controls['price'].setValue(product.price ? JSON.stringify(product.price) : '');
    this.productForm.controls['stockQuantity'].setValue(product.stockQuantity ? JSON.stringify(product.stockQuantity) : '');
    this.modalService.displayModal('md', this.addProductsModal);
  }
  
  updateProduct(product: IProduct) {
    this.productsService.update(product);
    this.modalService.closeAll();
  }

  openAddProductModal() {
    this.modalService.displayModal('md', this.addProductsModal);
  }

  public canAddProduct(): boolean {
    return this.authService.isSuperAdmin() || this.authService.hasRole('ROLE_ADMIN');
  }
  
  

}
