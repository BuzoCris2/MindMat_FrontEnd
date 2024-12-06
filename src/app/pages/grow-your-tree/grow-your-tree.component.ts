import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { GamesKnoledgeBaseComponent } from '../../components/game/games-knoledge-base/games-knoledge-base.component';
import { BackgroundComponent } from '../../components/grow-your-tree/background/background.component';
import { GrowingTreeComponent } from '../../components/grow-your-tree/growing-tree/growing-tree.component';
import { MathOperationsComponent } from '../../components/grow-your-tree/math-operations/math-operations.component';
import { TimerComponent } from '../../components/timer/timer.component';
import { GamesSaveScoreComponent } from '../../components/game/games-save-score/games-save-score.component';
import { ModalService } from '../../services/modal.service';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-grow-your-tree',
  standalone: true,
  imports: [
    CommonModule,
    GamesKnoledgeBaseComponent,
    BackgroundComponent,
    GrowingTreeComponent,
    MathOperationsComponent,
    TimerComponent,
    GamesSaveScoreComponent,
  ],
  templateUrl: './grow-your-tree.component.html',
  styleUrls: ['./grow-your-tree.component.scss']
})
export class GrowYourTreeComponent {
  currentTextIndex: number = 0;
  isGameActive: boolean = false; 
  growthStage: number = 0; 
  backgroundState: 'sunny' | 'cloudy' | 'rainy' = 'sunny'; 
  correctAnswers: number = 0; 
  wrongAnswers: number = 0; 
  gameStartTime: Date = new Date(); 
  selectedGame: number = 4;
  remainingTime: number = 0; 

  public scoreService: ScoreService = inject(ScoreService);
  public modalService: ModalService = inject(ModalService);

  @ViewChild('scoreModal') public scoreModal: any;

  constructor(private router: Router) {
    this.selectedGame = 4;
  }

  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;

    if (newIndex === 3) { 
      this.startGame();
    }
  }

  startGame() {
    this.isGameActive = true;
    this.backgroundState = 'sunny';
    this.gameStartTime = new Date(); 
  }

  handleAnswerCorrect() {
    this.correctAnswers++;
    this.updateBackgroundState();

    if (this.correctAnswers % 3 === 0 && this.growthStage < 8) {
      this.growthStage++;
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
    this.saveScore(); 
  }

  saveScore() {
    this.modalService.displayModal('md', this.scoreModal);
  }

  onContinue() {
    this.modalService.closeAll();
    this.isGameActive = false;
  }

}


