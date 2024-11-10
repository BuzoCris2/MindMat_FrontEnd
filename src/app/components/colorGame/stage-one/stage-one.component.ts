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
    { name: 'Purple', color: 'purple', unlocked: false },
    { name: 'Orange', color: 'orange', unlocked: false },
    { name: 'Green', color: 'green', unlocked: false },
    { name: 'Brown', color: 'brown', unlocked: false },
    { name: 'Cyan', color: 'cyan', unlocked: false },
    { name: 'Magenta', color: 'magenta', unlocked: false },
    { name: 'Violet', color: 'violet', unlocked: false },
    { name: 'Fuchsia', color: 'fuchsia', unlocked: false },
    { name: 'Cerulean', color: 'cerulean', unlocked: false }
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

  // Lógica de mezcla de colores
  blendColors(color1: string, color2: string): string {
    const colorCombinations: { [key: string]: string } = {
      'redblue': 'purple',
      'redyellow': 'orange',
      'blueyellow': 'green',
      'bluered': 'purple',
      'yellowred': 'orange',
      'yellowblue': 'green',
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
      case 'brown':
        this.setColorUnlocked('brown');
        break;
      case 'cyan':
        this.setColorUnlocked('cyan');
        break;
      case 'magenta':
        this.setColorUnlocked('magenta');
        break;
      case 'violet':
        this.setColorUnlocked('violet');
        break;
      case 'fuchsia':
        this.setColorUnlocked('fuchsia');
        break;
      case 'cerulean':
        this.setColorUnlocked('cerulean');
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

  // Función para reiniciar el juego
  resetGame() {
    this.emptyBuckets = Array(8).fill(null).map(() => ({ color: 'white' }));
    this.colors.forEach(color => color.unlocked = false); // Resetear los colores desbloqueados
    this.selectedBucketIndex = null; // Resetear el índice del bote seleccionado
  }
}
