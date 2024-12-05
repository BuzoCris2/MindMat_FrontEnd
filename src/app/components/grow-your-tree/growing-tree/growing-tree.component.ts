import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-growing-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './growing-tree.component.html',
  styleUrls: ['./growing-tree.component.scss'],
  animations: [
    trigger('grow', [
      state('visible', style({ opacity: 1 })), // Estado visible
      state('hidden', style({ opacity: 0 })), // Estado oculto
      transition('visible => hidden', [
        animate('0.5s ease-in') // Animación para desaparecer
      ]),
      transition('hidden => visible', [
        animate('0.5s ease-out') // Animación para aparecer
      ])
    ])
  ]
})
export class GrowingTreeComponent implements OnChanges {
  @Input() growthStage: number = 0; // Etapa de crecimiento, de 0 a 8
  currentTreeImage: string = ''; // URL de la imagen actual del árbol
  animationState: 'visible' | 'hidden' = 'visible'; // Estado de la animación
  currentTreeSize: { width: string, height: string } = { width: '200px', height: '500px' }; 
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['growthStage'] && !changes['growthStage'].firstChange) {
      // Inicia la animación de desvanecimiento cuando cambie growthStage
      this.animationState = 'hidden';

      setTimeout(() => {
        this.updateTreeImage();
        this.updateTreeSize(); // actualiza el tamaño del árbol
        // Cambia el estado de la animación para aparecer
        this.animationState = 'visible';
      }, 500); // Tiempo igual al de la animación de desaparición
    } else {
      // Actualiza la imagen y el tamaño al iniciar por primera vez
      this.updateTreeImage();
      this.updateTreeSize();
    }
  }

  // Método para actualizar la URL de la imagen del árbol
  updateTreeImage(): void {
    const imageIndex = this.growthStage + 1; 
    this.currentTreeImage = `url('../../../../assets/img/tree-game/arbol-${imageIndex}.png')`;
  }

  // Método para actualizar el tamaño del árbol
  updateTreeSize(): void {
    if (this.growthStage >= 4) {
      switch (this.growthStage) {
        case 4:
          this.currentTreeSize = { width: '250px', height: '575px' };
          break;
        case 5:
          this.currentTreeSize = { width: '250px', height: '670px' };
          break;
        case 6:
          this.currentTreeSize = { width: '300px', height: '750px' };
          break;
        case 7:
          this.currentTreeSize = { width: '350px', height: '825px' };
          break;
        case 8:
          this.currentTreeSize = { width: '380px', height: '875px' };
          break;
      }
    } else {
      this.currentTreeSize = { width: '200px', height: '500px' };
    }
  }
}
