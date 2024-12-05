import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { GamesKnoledgeBaseComponent } from '../../components/game/games-knoledge-base/games-knoledge-base.component';
import { BackgroundComponent } from '../../components/grow-your-tree/background/background.component';
import { GrowingTreeComponent } from '../../components/grow-your-tree/growing-tree/growing-tree.component';
import { MathOperationsComponent } from '../../components/grow-your-tree/math-operations/math-operations.component';
import { TimerComponent } from '../../components/timer/timer.component';
import { GamesSaveScoreComponent } from '../../components/game/games-save-score/games-save-score.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-grow-your-tree',
  standalone: true,
  imports: [CommonModule, GamesKnoledgeBaseComponent, BackgroundComponent, GrowingTreeComponent, MathOperationsComponent, TimerComponent, GamesSaveScoreComponent],
  templateUrl: './grow-your-tree.component.html',
  styleUrls: ['./grow-your-tree.component.scss']
})
export class GrowYourTreeComponent {
  currentTextIndex: number = 0;
  isGameActive: boolean = false; 
  growthStage: number = 0; 
  backgroundState: 'sunny' | 'cloudy' | 'rainy' = 'sunny'; 
  correctAnswersForGrowth: number = 0; 
  remainingTime: number = 0; 
  correctAnswers: number = 0; 
  wrongAnswers: number = 0; 
  gameStartTime: Date = new Date(); 
  showScoreModal: boolean = false; 
  
  constructor(private modalService: ModalService, private router: Router) {}

  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;

    if (newIndex === 3) { // Última página
      this.startGame();
    }
  }

  startGame() {
    this.isGameActive = true; 
    this.backgroundState = 'sunny';
    this.gameStartTime = new Date(); 
    this.showScoreModal = false;   }

  // Incrementa la etapa de crecimiento del árbol y genera una nueva operación matemática
  handleAnswerCorrect() {
    // Actualizar el estado del fondo en cada respuesta correcta
    this.updateBackgroundState();

    // Incrementar el contador de respuestas correctas para el crecimiento del árbol
    this.correctAnswersForGrowth++;
    this.correctAnswers++; // Incrementar el total de respuestas correctas

    // Cada 3 respuestas correctas, incrementar la etapa de crecimiento del árbol
    if (this.correctAnswersForGrowth >= 3) {
      this.correctAnswersForGrowth = 0; 
      if (this.growthStage < 8) {
        this.growthStage++;
      }
    }
  }

  handleAnswerWrong() {
    this.wrongAnswers++; 
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


  updateRemainingTime(time: number): void {
    this.remainingTime = time;
  }

  
  endGame() {
    console.log('¡El tiempo se ha agotado! El juego ha terminado.');
    this.saveScore(); // Guardar el puntaje y abrir el modal
  }

  saveScore() {
    const elapsedTime = this.calculateElapsedTime(); 
    this.showScoreModal = true;
  }

  calculateElapsedTime(): number {
    const now = new Date();
    return Math.floor((now.getTime() - this.gameStartTime.getTime()) / 1000);
  }
  
  onContinue() {
    this.isGameActive = false;
    this.router.navigateByUrl('/app/user-dashboard');
  }

  
}
