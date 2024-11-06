import {Component, Output, EventEmitter, Input, ElementRef, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-games-knoledge-base',
  standalone: true,
  imports: [],
  templateUrl: './games-knoledge-base.component.html',
  styleUrl: './games-knoledge-base.component.scss'
})
export class GamesKnoledgeBaseComponent {
  // EventEmitter para enviar el índice de texto al componente padre
  @Output() textIndexChange = new EventEmitter<number>();

  // Índice actual del texto
  currentIndex: number = 0;

  // Método para cambiar el índice y emitirlo al padre
  onRotateText() {
    this.currentIndex = (this.currentIndex + 1) % 3; // Alterna entre 0, 1 y 2
    this.textIndexChange.emit(this.currentIndex); // Emite el nuevo índice al padre
  }
  
}
