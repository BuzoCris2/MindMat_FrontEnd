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
  backgroundState: 'sunny' | 'cloudy' | 'rainy' = 'sunny'; // Estado del fondo
  correctAnswersForGrowth: number = 0; // Contador de respuestas correctas para el crecimiento del árbol

  // Método para actualizar el índice recibido desde el hijo
  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;

    if (newIndex === 3) { // Última página
      this.startGame();
    }
  }

  startGame() {
    this.isGameActive = true; // Activar el juego 
    this.backgroundState = 'sunny';
  }

  // Incrementa la etapa de crecimiento del árbol y genera una nueva operación matemática
  handleAnswerCorrect() {
    // Actualizar el estado del fondo en cada respuesta correcta
    this.updateBackgroundState();

    // Incrementar el contador de respuestas correctas para el crecimiento del árbol
    this.correctAnswersForGrowth++;

    // Cada 3 respuestas correctas, incrementar la etapa de crecimiento del árbol
    if (this.correctAnswersForGrowth >= 3) {
      this.correctAnswersForGrowth = 0; // Reiniciar el contador
      if (this.growthStage < 8) {
        this.growthStage++;
      }
    }
  }

  updateBackgroundState() {
    switch (this.backgroundState) {
      case 'sunny':
        this.backgroundState = 'cloudy';
        break;
      case 'cloudy':
        this.backgroundState = 'rainy';
        break;
      case 'rainy':
        this.backgroundState = 'sunny';
        break;
    }
  }

  // Método para terminar el juego
  endGame() {
    this.isGameActive = false;
  }
}
