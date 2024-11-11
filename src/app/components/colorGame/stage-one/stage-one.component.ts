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

  mixColors(color: string) {
    if (this.selectedBucketIndex !== null) {
      const selectedBucket = this.emptyBuckets[this.selectedBucketIndex];
  
      if (selectedBucket.color === 'white') {
        selectedBucket.color = color;
      } else {
        const { name, hex } = this.blendColors(selectedBucket.color, color);
        selectedBucket.color = hex; // Muestra el color mezclado en el bote
        this.unlockColors(name); // Desbloquea el color usando su nombre
      }
    }
  }
  
  blendColors(color1: string, color2: string): { name: string; hex: string } {
    const colorsHexMap: { [key: string]: string } = {
      'red-orange': '#E42D24',
      'amber': '#FFD400',
      'yellow-green': '#78B833',
      'blue-green': '#0090B3',
      'blue-purple': '#603085',
      'red-purple': '#C00040',
    };
  
    const colorCombinations: { [key: string]: string } = {
      'redblue': 'purple',
      'redyellow': 'orange',
      'blueyellow': 'green',
      'bluered': 'purple',
      'yellowred': 'orange',
      'yellowblue': 'green',
  
      'redorange': 'red-orange',
      'orangered': 'red-orange',
      'yelloworange': 'amber',
      'orangeyellow': 'amber',
      'yellowgreen': 'yellow-green',
      'greenyellow': 'yellow-green',
      'bluegreen': 'blue-green',
      'greenblue': 'blue-green',
      'bluepurple': 'blue-purple',
      'purpleblue': 'blue-purple',
      'redpurple': 'red-purple',
      'purplered': 'red-purple',
    };
  
    const combination = `${color1}${color2}`.toLowerCase();
    const colorName = colorCombinations[combination] || 'brown';
    const colorHex = colorsHexMap[colorName] || colorName;
  
    return { name: colorName, hex: colorHex };
  }  

  unlockColors(color: string) {
    switch (color) {
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
