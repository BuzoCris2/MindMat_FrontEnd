import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IProduct, ICategory } from '../../../interfaces';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss'
})
export class ProductsFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() productForm!: FormGroup;
  @Input() categories: ICategory[] = [];
  @Input() products: IProduct[] = [];
  @Output() callSaveMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callUpdateMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();


  callSave() {
    const categoryId = this.productForm.controls['categoryId'].value;
    console.log('Valor de categoryId:', categoryId);
    console.log('Lista de categorías disponibles:', this.categories);

    const selectedCategory = this.categories.find(cat => cat.id === Number(categoryId));


    if (!selectedCategory) {
      console.error('Categoría no encontrada');
      return;
    }

    let product: IProduct = {
      name: this.productForm.controls['name'].value,
      description: this.productForm.controls['description'].value,
      price: this.productForm.controls['price'].value,
      stockQuantity: this.productForm.controls['stockQuantity'].value,
      category: selectedCategory
    }
    if(this.productForm.controls['id'].value) {
      product.id = this.productForm.controls['id'].value;
    } 
    if(product.id) {
      this.callUpdateMethod.emit(product);
    } else {
      this.callSaveMethod.emit(product);
    }
  }

  ngOnInit() {
    console.log('Categorías recibidas en el formulario:', this.categories);
  }
  
}
