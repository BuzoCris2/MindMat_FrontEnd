import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScoreService } from '../../../services/score.service';
import { ModalService } from '../../../services/modal.service';
import { GamesKnoledgeBaseComponent } from '../../game/games-knoledge-base/games-knoledge-base.component';
import { GamesSaveScoreComponent } from '../../game/games-save-score/games-save-score.component';

@Component({
  selector: 'app-stage-two',
  standalone: true,
  imports: [CommonModule,
    GamesKnoledgeBaseComponent,
    GamesSaveScoreComponent],
  templateUrl: './stage-two.component.html',
  styleUrls: ['./stage-two.component.scss']
})
export class StageTwoComponent {
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  selectedGame: number = 0;
  selectedOption: string | null = null;
  isAnswerCorrect: boolean | null = null;
  showResult = false;
  isInteractionDisabled = false; // Nueva bandera para deshabilitar botones
  
  public scoreService: ScoreService = inject(ScoreService);
  public modalService: ModalService = inject(ModalService);

  @ViewChild('scoreModal') public scoreModal: any;
  constructor(){
    this.selectedGame = 5;
  }
  @Output() complete = new EventEmitter<void>();
  unlockAllQuestions(): void {
    this.complete.emit(); // Notifica al componente padre
  }

  questions = [
    {
      question: '¿Cómo se obtenía históricamente el pigmento rojo?',
      options: ['De la cochinilla', 'De minerales de arsénico', 'De hojas secas'],
      correctAnswer: 'De la cochinilla'
    },
    {
      question: '¿Cuál es la fuente principal para obtener el pigmento azul ultramar?',
      options: ['Lapislázuli', 'Flores de jacaranda', 'Cielo al amanecer'],
      correctAnswer: 'Lapislázuli'
    }
  ];

  selectAnswer(selectedOption: string) {
    if (this.isInteractionDisabled) return; // Evitar interacción si está bloqueada

    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.selectedOption = selectedOption;
    this.isAnswerCorrect = selectedOption === currentQuestion.correctAnswer;
    this.showResult = true;
    this.isInteractionDisabled = true; // Bloquear interacción

    // Incrementar contadores de respuestas correctas o incorrectas
    if (this.isAnswerCorrect) {
      this.correctAnswers++;
    } else {
      this.wrongAnswers++;
    }

    // Esperar 2 segundos antes de avanzar
    setTimeout(() => {
      this.showResult = false;
      this.isInteractionDisabled = false; // Desbloquear interacción
      this.selectedOption = null;
      this.currentQuestionIndex++;

      // Verificar si el cuestionario ha terminado
      if (this.isQuizCompleted()) {
        this.saveScore(this.correctAnswers, this.wrongAnswers);
      }
    }, 2000);
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.selectedOption = null;
    this.isAnswerCorrect = null;
    this.showResult = false;
    this.isInteractionDisabled = false; // Asegurarse de desbloquear interacción
  }

  isQuizCompleted(): boolean {
    return this.currentQuestionIndex >= this.questions.length;
  }

  saveScore(correct: number, wrong: number) {
    // Guardar los resultados del puntaje
    this.correctAnswers = correct;
    this.wrongAnswers = wrong;
    this.selectedGame = 5; // Puedes cambiar el valor según la lógica de tu juego
    this.modalService.displayModal('md', this.scoreModal);
  }

  closeModal(){
    this.modalService.closeAll();
  }
}
