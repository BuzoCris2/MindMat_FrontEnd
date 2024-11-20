import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stage-two',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './stage-two.component.html',
  styleUrls: ['./stage-two.component.scss']
})
export class StageTwoComponent {
  currentQuestionIndex = 0;
  score = 0;

  constructor(private router: Router) {}

  goToStageThree() {
    this.router.navigate(['/stage-three']); // Ajusta la ruta según tu configuración
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
      question: '¿Qué planta se usaba para obtener tonos verdes?',
      options: ['Malaquita triturada', 'Hojas de albahaca', 'Pasto fermentado'],
      correctAnswer: 'Malaquita triturada'
    },
    {
      question: '¿Qué combinación de minerales daba lugar al púrpura?',
      options: ['Murex', 'Oxidación del cobre', 'Polvo de amatista'],
      correctAnswer: 'Murex'
    },
    {
      question: '¿Cómo se obtenían los tonos marrones?',
      options: ['De la tierra rica en óxidos', 'De raíces de betabel', 'De la savia de árboles secos'],
      correctAnswer: 'De la tierra rica en óxidos'
    }
  ];

  // Verifica si la respuesta es correcta y avanza a la siguiente pregunta
  selectAnswer(selectedOption: string) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      this.score++;
    }
    this.currentQuestionIndex++;
  }

  // Reinicia el juego
  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
  }

  // Verifica si ya se respondieron todas las preguntas
  isQuizCompleted(): boolean {
    return this.currentQuestionIndex >= this.questions.length;
  }
}
