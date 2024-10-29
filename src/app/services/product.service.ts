import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IProduct, ISearch } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<IProduct> {
  protected override source: string = 'products';
  private productListSignal = signal<IProduct[]>([]);
  get products$() {
    return this.productListSignal;
  }
  public search: ISearch = { 
    page: 1,
    size: 5
  }
  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size}).subscribe({
      next: (response: any) => {
        console.log("Productos recibidos del backend:", response.data);
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.productListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  save(product: IProduct) {
    console.log("Enviando producto:", product);
    this.add(product).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the product','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(product: IProduct) {
    this.editCustomSource(`${product.id}`, product).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the product','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(product: IProduct) {
    this.delCustomSource(`${product.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the product','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

}
