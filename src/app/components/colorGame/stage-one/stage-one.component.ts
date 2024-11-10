import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-stage-one',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stage-one.component.html',
  styleUrls: ['./stage-one.component.scss']
})
export class StageOneComponent {
  // Colores disponibles
  colors = [
    { name: 'Red', color: 'red', unlocked: true },
    { name: 'Blue', color: 'blue', unlocked: true },
    { name: 'Yellow', color: 'yellow', unlocked: true },
    { name: 'Purple', color: 'purple', unlocked: false },
    { name: 'Orange', color: 'orange', unlocked: false },
    { name: 'Green', color: 'green', unlocked: false },
    { name: 'Brown', color: 'brown', unlocked: false },
    { name: 'Cyan', color: 'cyan', unlocked: false },
    { name: 'Magenta', color: 'magenta', unlocked: false }
  ];

  // Botes vacíos (7 botes)
  emptyBuckets = [
    { id: 1, color: 'white', selected: false },
    { id: 2, color: 'white', selected: false },
    { id: 3, color: 'white', selected: false },
    { id: 4, color: 'white', selected: false },
    { id: 5, color: 'white', selected: false },
    { id: 6, color: 'white', selected: false },
    { id: 7, color: 'white', selected: false }
  ];

  // Estado del bote seleccionado
  selectedBucketId: number | null = null;

  // Función para seleccionar un bote
  selectBucket(bucketId: number) {
    // Si el bote ya está seleccionado, deseleccionarlo
    this.selectedBucketId = this.selectedBucketId === bucketId ? null : bucketId;
  }

  // Función para mezclar los colores
  mixColors(color: string) {
    if (this.selectedBucketId !== null) {
      const selectedBucket = this.emptyBuckets.find(bucket => bucket.id === this.selectedBucketId);
      if (selectedBucket) {
        // Si el bote está vacío, asignar el primer color
        if (selectedBucket.color === 'white') {
          selectedBucket.color = color;
        } else {
          // Si ya tiene un color, mezclarlo con el nuevo color
          selectedBucket.color = this.blendColors(selectedBucket.color, color);
        }
      }
    }
  }

  // Función para mezclar los colores
  blendColors(color1: string, color2: string): string {
    const colorCombinations: { [key: string]: string } = {
      'redblue': 'purple',
      'redyellow': 'orange',
      'blueyellow': 'green',
      'bluered': 'purple',
      'yellowred': 'orange',
      'yellowblue': 'green',
      'redgreen': 'brown',
      'bluegreen': 'brown',
      'yellowgreen': 'brown'
    };

    // Combina los colores y retorna el resultado
    const combination = `${color1}${color2}`.toLowerCase();
    return colorCombinations[combination] || 'brown'; // Si no hay combinación específica, se usa un color genérico
  }

  // Función para reiniciar el juego
  resetGame() {
    this.emptyBuckets.forEach(bucket => bucket.color = 'white');
    this.selectedBucketId = null;
  }
}
