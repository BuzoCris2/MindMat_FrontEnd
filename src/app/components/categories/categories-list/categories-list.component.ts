import { AfterViewInit, Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ICategory, IRoleType } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent {
  @Input() title: string  = '';
  @Input() categories: ICategory[] = [];
  @Output() callModalAction: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callDeleteAction: EventEmitter<ICategory> = new EventEmitter<ICategory>();

  public authService: AuthService = inject(AuthService);

  canPerformActions(): boolean {
    return this.authService.hasRole(IRoleType.admin) || this.authService.isSuperAdmin();
  }

  public trackById(index: number, item: ICategory): number {
    return item.id || 0;
  }
}
