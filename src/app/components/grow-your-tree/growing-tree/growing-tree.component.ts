import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-growing-tree',
  standalone: true,
  templateUrl: './growing-tree.component.html',
  styleUrls: ['./growing-tree.component.scss'],
  animations: [
    trigger('grow', [
      state('0', style({
        transform: 'scale(0.1)', // Tamaño inicial muy pequeño
      })),
      state('1', style({
        transform: 'scale(0.3)', // Primera etapa de crecimiento
      })),
      state('2', style({
        transform: 'scale(0.6)', // Segunda etapa de crecimiento
      })),
      state('3', style({
        transform: 'scale(1)', // Tamaño completo
      })),
      transition('* => *', [
        animate('2s ease-in-out') // Transición suave de 2 segundos
      ])
    ]),
  ]
})
export class GrowingTreeComponent {
  @Input() growthStage: number = 0; // Etapa de crecimiento, de 0 a 3 (puedes expandirla)
}
