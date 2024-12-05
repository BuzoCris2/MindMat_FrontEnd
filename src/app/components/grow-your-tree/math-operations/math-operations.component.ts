import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-math-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './math-operations.component.html',
  styleUrls: ['./math-operations.component.scss']
})
export class MathOperationsComponent {
  @Input() mathVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() answerCorrect = new EventEmitter<void>(); 
  @Output() answerWrong = new EventEmitter<void>();
  number1: number = 0;
  number2: number = 0;
  operator: string = '';
  userAnswer: string = '';

  quickFeedbackVisible: boolean = false;
  quickFeedbackMessage: string = '';
  quickFeedbackType: 'success' | 'error' = 'success';

  showAlert: boolean = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage: string = '';

  correctAnswersCount: number = 0; // Contador de respuestas correctas en el ciclo actual
  progressPercentage: number = 0; // Porcentaje de la barra de progreso
  totalCorrectAnswers: number = 0; // Total de respuestas correctas en el juego
  currentPhase: string = 'Absorción de luz'; 

  phases = ['Captura de luz solar', 'Fabricación de energía', 'Fabricación de comida']; // Fases del ciclo

  ngOnInit() {
    this.generateMathOperation();
  }

  // Método para generar una operación matemática aleatoria
  generateMathOperation() {
    this.number1 = Math.floor(Math.random() * 10) + 1;
    this.number2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*', '/'];
    this.operator = operators[Math.floor(Math.random() * operators.length)];

    if (this.operator === '/') {
      // Generar divisiones válidas
      while (this.number1 % this.number2 !== 0) {
        this.number1 = Math.floor(Math.random() * 10) + 1;
        this.number2 = Math.floor(Math.random() * 10) + 1;
      }
    }
  }

  // Método para enviar la respuesta del usuario
  submitAnswer() {
    const correctAnswer = this.calculateCorrectAnswer();
    const userAnswerNumber = parseFloat(this.userAnswer);

    if (userAnswerNumber === correctAnswer) {
      this.showFeedbackMessage(true);
      this.correctAnswersCount++;
      this.totalCorrectAnswers++; 
      this.answerCorrect.emit();
      // Actualizar el progreso del ciclo de la fotosíntesis y la fase actual
      this.updateProgress();
      this.updatePhase();

      // Si se completan tres respuestas correctas, reinicia la barra y emite el evento
      if (this.correctAnswersCount === 3) {
        this.correctAnswersCount = 0; 
        this.progressPercentage = 0; 
      }

      this.generateMathOperation(); // Generar una nueva operación matemática después de la respuesta correcta
    } else {
      this.showFeedbackMessage(false);
      this.answerWrong.emit();
    }

    setTimeout(() => {
      this.userAnswer = '';
    }, 1000);
  }

  // Método para actualizar el progreso de la barra
  updateProgress(): void {
    this.progressPercentage = (this.correctAnswersCount / 3) * 100;
  }

  // Método para actualizar la fase del ciclo de fotosíntesis
  updatePhase(): void {
    this.currentPhase = this.phases[this.correctAnswersCount % this.phases.length];
  }

  // Método para calcular la respuesta correcta
  calculateCorrectAnswer(): number {
    switch (this.operator) {
      case '+':
        return this.number1 + this.number2;
      case '-':
        return this.number1 - this.number2;
      case '*':
        return this.number1 * this.number2;
      case '/':
        return this.number1 / this.number2;
      default:
        return 0;
    }
  }

  // Método para mostrar el mensaje de retroalimentación
  showFeedbackMessage(isCorrect: boolean) {
    if (isCorrect) {
      this.quickFeedbackMessage = '¡Respuesta correcta! 🎉';
      this.quickFeedbackType = 'success';
    } else {
      this.quickFeedbackMessage = 'Respuesta incorrecta 😞';
      this.quickFeedbackType = 'error';
    }
    this.quickFeedbackVisible = true;
    setTimeout(() => {
      this.quickFeedbackVisible = false;
    }, 1000);
  }
}
