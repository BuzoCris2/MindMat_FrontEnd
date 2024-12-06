import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesKnoledgeBaseComponent } from '../../components/game/games-knoledge-base/games-knoledge-base.component';
import { BackgroundComponent } from '../../components/grow-your-tree/background/background.component';

@Component({
  selector: 'app-grow-your-tree',
  standalone: true,
  imports: [CommonModule,
    GamesKnoledgeBaseComponent,BackgroundComponent],
  templateUrl: './grow-your-tree.component.html',
  styleUrl: './grow-your-tree.component.scss'
})
export class GrowYourTreeComponent {
  currentTextIndex: number = 0;
  isGameActive: boolean = false; // Indica si el juego está activo

  // Método para actualizar el índice recibido desde el hijo
  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;

    if (newIndex === 3) { // Última página
      this.isGameActive = true;
    }
  }


  // Método para terminar el juego
  endGame() {
    this.isGameActive = false;
  }

}