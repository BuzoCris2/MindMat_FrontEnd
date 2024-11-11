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

  emptyBuckets = Array(8).fill(null).map(() => ({ color: 'white' }));
  selectedBucketIndex: number | null = null;
  selectedColor: string | null = null;
  selectedColorName: string | null = null;

  mixColors(color: string) {
    if (this.selectedBucketIndex !== null) {
      const selectedBucket = this.emptyBuckets[this.selectedBucketIndex];
  
      if (selectedBucket.color === 'white') {
        selectedBucket.color = color;
      } else {
        const { name, hex } = this.blendColors(selectedBucket.color, color);
        selectedBucket.color = hex;
        this.unlockColors(name);
      }
    }
  }

  blendColors(color1: string, color2: string): { name: string; hex: string } {
    const colorsHexMap: { [key: string]: string } = {
      'red': '#FF0000',
      'blue': '#0000FF',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'green': '#008000',
      'purple': '#800080',
      'red-orange': '#E42D24',
      'amber': '#FFD400',
      'yellow-green': '#78B833',
      'blue-green': '#0090B3',
      'blue-purple': '#603085',
      'red-purple': '#C00040',
      'brown': '#8B4513'
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
    const colorHex = colorsHexMap[colorName] || '#8B4513';

    return { name: colorName, hex: colorHex };
  }

  unlockColors(color: string) {
    const colorToUnlock = this.colors.find(c => c.color === color);
    if (colorToUnlock) {
      colorToUnlock.unlocked = true;
    }
  }

  colorHex(colorName: string): string {
    const colorsHexMap: { [key: string]: string } = {
      'red': '#FF0000',
      'blue': '#0000FF',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'green': '#008000',
      'purple': '#800080',
      'red-orange': '#E42D24',
      'amber': '#FFD400',
      'yellow-green': '#78B833',
      'blue-green': '#0090B3',
      'blue-purple': '#603085',
      'red-purple': '#C00040',
      'brown': '#8B4513'
    };

    return colorsHexMap[colorName] || '#8B4513';
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.selectedColorName = this.colors.find(c => c.color === color)?.name || '';
  }

  selectBucket(index: number) {
    this.selectedBucketIndex = index;
    if (this.selectedColor) {
      this.mixColors(this.selectedColor);
    }
  }

  resetGame() {
    this.emptyBuckets = Array(8).fill(null).map(() => ({ color: 'white' }));
    this.selectedColor = null;
    this.selectedColorName = null;
    this.selectedBucketIndex = null;
  }
}