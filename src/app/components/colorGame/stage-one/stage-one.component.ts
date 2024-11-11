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
  // Colores disponibles (primarios, secundarios y terciarios)
  colors = [
    { name: 'Red', color: 'red', unlocked: true },
    { name: 'Blue', color: 'blue', unlocked: true },
    { name: 'Yellow', color: 'yellow', unlocked: true },
    { name: 'Orange', color: 'orange', unlocked: false },
    { name: 'Green', color: 'green', unlocked: false },
    { name: 'Purple', color: 'purple', unlocked: false },
    { name: 'Red Orange', color: 'red-orange', unlocked: false },
    { name: 'Amber', color: 'amber', unlocked: false },
    { name: 'Yellow Green', color: 'yellow-green', unlocked: false },
    { name: 'Blue Green', color: 'blue-green', unlocked: false },
    { name: 'Blue Purple', color: 'blue-purple', unlocked: false },
    { name: 'Red Purple', color: 'red-purple', unlocked: false }
  ];

  // Estado de los botes, cada uno con su color inicial
  emptyBuckets = Array(8).fill(null).map(() => ({ color: 'white' }));

  // Bote seleccionado (índice)
  selectedBucketIndex: number | null = null;

  // Función para mezclar los colores en el bote seleccionado
  mixColors(color: string) {
    if (this.selectedBucketIndex !== null) {
      const selectedBucket = this.emptyBuckets[this.selectedBucketIndex];

      // Si el bote está vacío, asignamos el color inicial
      if (selectedBucket.color === 'white') {
        selectedBucket.color = color;
      } else {
        // Si el bote tiene un color, mezclamos con el nuevo color
        selectedBucket.color = this.blendColors(selectedBucket.color, color);
      }

      // Desbloquear nuevos colores al hacer la mezcla
      this.unlockColors(selectedBucket.color);
    }
  }

  // Lógica de mezcla de colores (primarios, secundarios y terciarios)
  blendColors(color1: string, color2: string): string {
    const colorCombinations: { [key: string]: string } = {
      // Primarios -> Secundarios
      'redblue': 'purple',
      'redyellow': 'orange',
      'blueyellow': 'green',
      'bluered': 'purple',
      'yellowred': 'orange',
      'yellowblue': 'green',

      // Secundarios -> Terciarios
      'redorange': '#E42D24',
      'orangered': '#E42D24',
      'yelloworange': '#FFD400',
      'orangeyellow': '#FFD400',
      'yellowgreen': '#78B833',
      'greenyellow': '#78B833',
      'bluegreen': '#0090B3',
      'greenblue': '#0090B3',
      'bluepurple': '#603085',
      'purpleblue': '#603085',
      'redpurple': '#C00040',
      'purplered': '#C00040',
    };

    // Combina los colores y retorna el resultado
    const combination = `${color1}${color2}`.toLowerCase();
    return colorCombinations[combination] || 'brown'; // Si no hay combinación específica, se usa un color genérico
  }

  // Función para desbloquear colores (secundarios y terciarios)
  unlockColors(color: string) {
    // Cuando se desbloquea un color, lo marcamos como 'unlocked'
    switch(color) {
      case 'purple':
        this.setColorUnlocked('purple');
        break;
      case 'orange':
        this.setColorUnlocked('orange');
        break;
      case 'green':
        this.setColorUnlocked('green');
        break;
      case 'red-orange':
        this.setColorUnlocked('red-orange');
        break;
      case 'amber':
        this.setColorUnlocked('amber');
        break;
      case 'yellow-green':
        this.setColorUnlocked('yellow-green');
        break;
      case 'blue-green':
        this.setColorUnlocked('blue-green');
        break;
      case 'blue-purple':
        this.setColorUnlocked('blue-purple');
        break;
      case 'red-purple':
        this.setColorUnlocked('red-purple');
        break;
    }
  }

  // Helper para marcar un color como desbloqueado
  setColorUnlocked(color: string) {
    const colorToUnlock = this.colors.find(c => c.color === color);
    if (colorToUnlock) {
      colorToUnlock.unlocked = true;
    }
  }

  // Función para seleccionar un bote (para aplicar la mezcla)
  selectBucket(index: number) {
    this.selectedBucketIndex = index;
  }

  resetGame() {
    this.emptyBuckets = Array(8).fill(null).map(() => ({ color: 'white' }));
    this.selectedBucketIndex = null; // Resetear el índice del bote seleccionado
    // Los colores desbloqueados se mantienen como están
  }
}
