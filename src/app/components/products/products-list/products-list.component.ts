import { AfterViewInit, Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { IProduct, IRoleType } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  @Input() title: string  = '';
  @Input() products: IProduct[] = [];
  @Output() callModalAction: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callDeleteAction: EventEmitter<IProduct> = new EventEmitter<IProduct>();

  public authService: AuthService = inject(AuthService);

  canPerformActions(): boolean {
    return this.authService.hasRole(IRoleType.admin) || this.authService.isSuperAdmin();
  }

  public trackById(index: number, item: IProduct): number {
    return item.id || 0;
  }
}
