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
      options: [ 'De minerales de arsénico', 'De la cochinilla', 'De hojas secas'],
      correctAnswer: 'De la cochinilla'
    },
    {
      question: '¿Cuál es la fuente principal para obtener el pigmento azul ultramar?',
      options: ['Lapislázuli', 'Flores de jacaranda', 'Cielo al amanecer'],
      correctAnswer: 'Lapislázuli'
    },
    {
      question: '¿Qué fuente natural se usaba para obtener amarillo?',
      options: ['Oro en polvo','Cúrcuma', 'Hojas de arce'],
      correctAnswer: 'Cúrcuma'
    },
    {
      question: '¿Qué se utilizaba históricamente para obtener pigmentos naranjas?',
      options: ['Minerales como el realgar', 'Hojas de zanahoria', 'Flores secas de caléndula'],
      correctAnswer: 'Minerales como el realgar'
    },
    {
      question: '¿Qué se usaba para obtener tonos verdes?',
      options: ['Hojas de albahaca', 'Pasto fermentado','Malaquita triturada'],
      correctAnswer: 'Malaquita triturada'
    },
    {
      question: '¿Qué combinación de minerales daba lugar al púrpura?',
      options: ['Oxidación del cobre','Murex', 'Polvo de amatista'],
      correctAnswer: 'Murex'
    },
    {
      question: '¿Qué combinación de pigmentos se usaba para obtener azul verdoso?',
      options: ['Azul ultramar y malaquita', 'Cúrcuma y lapislázuli', 'Realgar y murex'],
      correctAnswer: 'Azul ultramar y malaquita'
    },
    {
      question: '¿Cuál era el origen del pigmento ámbar?',
      options: ['Hojas de arce y polvo de amatista','Cúrcuma y minerales', 'Flores secas y realgar'],
      correctAnswer: 'Cúrcuma y minerales'
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
    // Eliminar el uso de ModalService aquí
    // Ya que estamos controlando la visibilidad con *ngIf
}

  closeModal(){
    this.modalService.closeAll();
  }
}
