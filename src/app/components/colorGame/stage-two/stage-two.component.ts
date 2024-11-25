import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stage-two',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stage-two.component.html',
  styleUrls: ['./stage-two.component.scss']
})
export class StageTwoComponent {
  currentQuestionIndex = 0;
  score = 0;
  selectedOption: string | null = null;
  isAnswerCorrect: boolean | null = null;
  showResult = false;
  isInteractionDisabled = false; // Nueva bandera para deshabilitar botones

  @Output() complete = new EventEmitter<void>();
  unlockAllQuestions(): void {
    // Lógica para desbloquear todos los colores
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
    },
    {
      question: '¿Qué fuente natural se usaba para obtener amarillo?',
      options: ['Cúrcuma', 'Oro en polvo', 'Hojas de arce'],
      correctAnswer: 'Cúrcuma'
    },
    {
      question: '¿Qué se utilizaba históricamente para obtener pigmentos naranjas?',
      options: ['Minerales como el realgar', 'Hojas de zanahoria', 'Flores secas de caléndula'],
      correctAnswer: 'Minerales como el realgar'
    },
    {
      question: '¿Qué se usaba para obtener tonos verdes?',
      options: ['Malaquita triturada', 'Hojas de albahaca', 'Pasto fermentado'],
      correctAnswer: 'Malaquita triturada'
    },
    {
      question: '¿Qué combinación de minerales daba lugar al púrpura?',
      options: ['Murex', 'Oxidación del cobre', 'Polvo de amatista'],
      correctAnswer: 'Murex'
    },
    {
      question: '¿Qué combinación de pigmentos se usaba para obtener azul verdoso?',
      options: ['Azul ultramar y malaquita', 'Cúrcuma y lapislázuli', 'Realgar y murex'],
      correctAnswer: 'Azul ultramar y malaquita'
    },
    {
      question: '¿Cuál era el origen del pigmento ámbar?',
      options: ['Cúrcuma y minerales', 'Hojas de arce y polvo de amatista', 'Flores secas y realgar'],
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

    // Esperar 2 segundos antes de avanzar
    setTimeout(() => {
      this.showResult = false;
      this.isInteractionDisabled = false; // Desbloquear interacción
      this.selectedOption = null;
      this.currentQuestionIndex++;
    }, 2000);

    if (this.isAnswerCorrect) {
      this.score++;
    }
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedOption = null;
    this.isAnswerCorrect = null;
    this.showResult = false;
    this.isInteractionDisabled = false; // Asegurarse de desbloquear interacción
  }

  isQuizCompleted(): boolean {
    return this.currentQuestionIndex >= this.questions.length;
  }
}
