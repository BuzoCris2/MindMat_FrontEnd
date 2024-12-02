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
  @Output() answerCorrect = new EventEmitter<void>(); // Emitir evento si la respuesta es correcta

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
      this.answerCorrect.emit(); // Emitir que la respuesta es correcta
      this.generateMathOperation(); // Generar una nueva operación matemática después de la respuesta correcta
    } else {
      this.showFeedbackMessage(false);
    }

    setTimeout(() => {
      this.userAnswer = '';
    }, 1000);
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
