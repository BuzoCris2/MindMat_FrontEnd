import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GamesKnoledgeBaseComponent } from '../../game/games-knoledge-base/games-knoledge-base.component';

@Component({
  selector: 'app-stage-one',
  standalone: true,
  imports: [CommonModule,GamesKnoledgeBaseComponent],
  templateUrl: './stage-one.component.html',
  styleUrls: ['./stage-one.component.scss']
})
export class StageOneComponent {
  @Output() complete = new EventEmitter<void>();

  currentTextIndex: number = 0;
  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;
  }

  // Colores definidos
  colors = [
    { name: 'Rojo', color: 'red', unlocked: true, description: 'Históricamente, el pigmento rojo se obtenía de la cochinilla, un insecto que vive en los nopales. Su tinte era muy apreciado en textiles y arte.' },
    { name: 'Azul', color: 'blue', unlocked: true, description: 'El azul ultramar provenía del lapislázuli, una piedra preciosa extraída principalmente de Afganistán. Era uno de los pigmentos más costosos y valiosos.' },
    { name: 'Amarillo', color: 'yellow', unlocked: true, description: 'El pigmento amarillo se extraía de fuentes naturales como la cúrcuma o minerales como el oropimente. Se utilizaba en pinturas y tintes.' },
    { name: 'Naranja', color: 'orange', unlocked: false, description: 'El pigmento naranja se obtenía de minerales como el realgar, un compuesto de arsénico utilizado en pinturas antiguas.' },
    { name: 'Verde', color: 'green', unlocked: false, description: 'Los tonos verdes se lograban con malaquita triturada, un mineral de cobre. También se combinaban pigmentos amarillos y azules.' },
    { name: 'Púrpura', color: 'purple', unlocked: false, description: 'El púrpura se extraía de moluscos como el murex. Era símbolo de riqueza y poder debido a su complejidad para producirlo.' },
    { name: 'Rojo Naranja', color: 'red-orange', unlocked: false, description: 'Un tono cálido intermedio entre rojo y naranja, representaba energía y creatividad, aunque no tenía una fuente específica histórica.' },
    { name: 'Ámbar', color: 'amber', unlocked: false, description: 'El ámbar, un tono amarillo-anaranjado, evocaba luz y calidez. Podía lograrse mezclando pigmentos naturales de cúrcuma y minerales.' },
    { name: 'Amarillo Verde', color: 'yellow-green', unlocked: false, description: 'Este tono fresco y vibrante se creaba mezclando pigmentos amarillos y verdes, usado para representar naturaleza joven.' },
    { name: 'Azul Verde', color: 'blue-green', unlocked: false, description: 'Un tono de transición entre azul y verde, asociado al agua y la tranquilidad. Mezclaba azul ultramar con malaquita.' },
    { name: 'Azul Púrpura', color: 'blue-purple', unlocked: false, description: 'Un color profundo e intrigante, resultado de la mezcla de lapislázuli y pigmentos púrpuras como el del murex.' },
    { name: 'Rojo Púrpura', color: 'red-purple', unlocked: false, description: 'Un tono rico y lujoso, simbolizaba pasión y nobleza. Se lograba mezclando pigmentos de cochinilla con púrpura de murex.' }
  ];

  // Propiedad para almacenar la imagen del cubo
  bucketImage: string = 'assets/img/paint-buckets/whitePaint.png'; // Imagen inicial (cubo blanco)

  selectedBucketIndex: number | null = null;
  selectedColor: string | null = null;
  selectedColorName: string | null = null;
  selectedColorDescription: string | null = null;

  constructor(private router: Router) { }

  emptyBuckets = Array(10).fill(null).map(() => ({
    color: 'white',
    image: 'assets/img/paint-buckets/whitePaint.png' // Imagen inicial de cada cubo
  }));
  
  mixColors(color: string) {
    if (this.selectedBucketIndex !== null) {
      const selectedBucket = this.emptyBuckets[this.selectedBucketIndex];
  
      if (selectedBucket.color === 'white') {
        selectedBucket.color = color; // Asignar color por nombre
        selectedBucket.image = this.getBucketImage(color); // Obtener imagen por nombre
      } else {
        const { name, hex } = this.blendColors(selectedBucket.color, color); // Usar nombre para la mezcla
        selectedBucket.color = name; // Guardar nombre del color
        selectedBucket.image = this.getBucketImage(name); // Asignar imagen según el nombre
        this.unlockColors(name); // Desbloquear color por nombre
      }
    }
  }  
  
  blendColors(color1: string, color2: string): { name: string; hex: string } {
    // Combinaciones de colores basadas en los nombres
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
  
    // Asegurarse de que los colores estén en minúsculas para la comparación
    const combination = `${color1}${color2}`.toLowerCase(); 
    const mixedColorName = colorCombinations[combination] || 'brown'; // Usar un color predeterminado
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
  
    // Obtener el color hexadecimal
    const colorHex = colorsHexMap[mixedColorName];
  
    return { name: mixedColorName, hex: colorHex };
  }

  unlockColors(color: string) {
    const colorToUnlock = this.colors.find(c => c.color === color);
    if (colorToUnlock) {
      colorToUnlock.unlocked = true;
      this.checkAllColorsUnlocked();
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
    const selectedColorObj = this.colors.find(c => c.color === color);
    this.selectedColorName = selectedColorObj?.name || null;
    this.selectedColorDescription = selectedColorObj?.description || null;
  }

  selectBucket(index: number) {
    this.selectedBucketIndex = index;
    if (this.selectedColor) {
      this.mixColors(this.selectedColor);
    }
  }
  
  // Función para obtener la imagen según el nombre del color
  getBucketImage(color: string): string {
    const bucketImages: { [key: string]: string } = {
      'red': 'assets/img/paint-buckets/redPaint.png',
      'blue': 'assets/img/paint-buckets/bluePaint.png',
      'yellow': 'assets/img/paint-buckets/yellowPaint.png',
      'orange': 'assets/img/paint-buckets/orangePaint.png',
      'green': 'assets/img/paint-buckets/greenPaint.png',
      'purple': 'assets/img/paint-buckets/purplePaint.png',
      'red-orange': 'assets/img/paint-buckets/red-orangePaint.png',
      'amber': 'assets/img/paint-buckets/amberPaint.png',
      'yellow-green': 'assets/img/paint-buckets/yellow-greenPaint.png',
      'blue-green': 'assets/img/paint-buckets/blue-greenPaint.png',
      'blue-purple': 'assets/img/paint-buckets/blue-purplePaint.png',
      'red-purple': 'assets/img/paint-buckets/red-purplePaint.png',
      'brown': 'assets/img/paint-buckets/brownPaint.png', // Imagen predeterminada
    };
    return bucketImages[color] || 'assets/img/paint-buckets/whitePaint.png'; // Imagen predeterminada si no se encuentra el color
  }

  resetGame() {
    this.emptyBuckets = Array(10).fill(null).map(() => ({
      color: 'white',
      image: 'assets/img/paint-buckets/whitePaint.png' // Imagen inicial del cubo
    }));
    this.selectedColor = null;
    this.selectedColorName = null;
    this.selectedBucketIndex = null;
  }

  allColorsUnlocked: boolean = false;

  checkAllColorsUnlocked() {
    this.allColorsUnlocked = this.colors.every(color => color.unlocked);
  }

  unlockAllColors(): void {
    // Lógica para desbloquear todos los colores
    this.complete.emit(); // Notifica al componente padre
  }
}
