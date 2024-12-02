import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesKnoledgeBaseComponent } from '../../components/game/games-knoledge-base/games-knoledge-base.component';
import { BackgroundComponent } from '../../components/grow-your-tree/background/background.component';
import { GrowingTreeComponent } from '../../components/grow-your-tree/growing-tree/growing-tree.component';
import { MathOperationsComponent } from '../../components/grow-your-tree/math-operations/math-operations.component';

@Component({
  selector: 'app-grow-your-tree',
  standalone: true,
  imports: [CommonModule, GamesKnoledgeBaseComponent, BackgroundComponent, GrowingTreeComponent, MathOperationsComponent],
  templateUrl: './grow-your-tree.component.html',
  styleUrls: ['./grow-your-tree.component.scss']
})
export class GrowYourTreeComponent {
  currentTextIndex: number = 0;
  isGameActive: boolean = false; // Indica si el juego está activo
  growthStage: number = 0; // Controla la etapa de crecimiento del árbol

  // Método para actualizar el índice recibido desde el hijo
  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;

    if (newIndex === 3) { // Última página
      this.startGame();
    }
  }

  startGame() {
    this.isGameActive = true; // Activar el juego y el fondo
  }

  // Incrementa la etapa de crecimiento del árbol y genera una nueva operación matemática
  handleAnswerCorrect() {
    if (this.growthStage < 3) {
      this.growthStage++;
    }
  }

  // Método para terminar el juego
  endGame() {
    this.isGameActive = false;
  }
}
