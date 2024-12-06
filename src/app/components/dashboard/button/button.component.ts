import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() label!: string; // Etiqueta del botón
  @Input() color: string = 'primary'; // Clase de color
  @Input() icon?: string; // Icono opcional
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>(); // Evento click
}
