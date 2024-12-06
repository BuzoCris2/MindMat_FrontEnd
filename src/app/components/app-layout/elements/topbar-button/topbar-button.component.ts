import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-topbar-button',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './topbar-button.component.html',
  styleUrls: ['./topbar-button.component.scss'],
})
export class TopbarButtonComponent {
  @Input() icon!: string; // Icono del botón
  @Input() label?: string; // Etiqueta opcional
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>(); // Evento click
}