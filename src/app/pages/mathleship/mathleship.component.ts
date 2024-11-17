import { Component, OnInit } from '@angular/core';
import { MathleshipService } from '../../services/mathleship.service';
import { TimerComponent } from '../../components/timer/timer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IShip, IGridCell } from '../../interfaces';
import { AlertModalComponent } from '../../components/alert/alert-modal.component';

@Component({
  selector: 'app-mathleship',
  standalone: true,
  templateUrl: './mathleship.component.html',
  styleUrls: ['./mathleship.component.scss'],
  imports: [CommonModule, FormsModule, TimerComponent, AlertModalComponent]
})
export class MathleshipComponent implements OnInit {
  //board: string[][] = Array.from({ length: 6 }, () => Array(6).fill(''));
  board: string[][] = [];
  timerValue: string = '03:00'; 

  showAlert = false;
  alertType: 'time' | 'error' | 'success' = 'success';
  alertTitle = '¡Éxito!';
  alertMessage = 'Campo avatarId actualizado con éxito';

  mathVisible = false;
  showResult = false;
  number1: number = 0;
  number2: number = 0;
  operator: string = '';
  userAnswer: string = '';
  resultMessage: string = '';

  constructor(private mathleshipService: MathleshipService) {}

  ngOnInit(): void {
    this.initializeGame();

    this.mathleshipService.getShips().subscribe({
  next: (response) => {
    console.log('Datos recibidos de los barcos:', response);
    if (response) {  // Asegurarse de que response no sea null o undefined
      this.board = this.buildBoard(response);
    } else {
      console.error('No se recibieron datos de los barcos.');
    }
  },
  error: (err) => console.error('Error al obtener los barcos', err)
});

  }

  initializeGame() {
    this.mathleshipService.initializeBoard().subscribe({
      next: (data: IShip[]) => {
        this.board = this.buildBoard(data);
      },
      error: (err) => console.error('Error initializing game', err)
    });
  }

  buildBoard(ships: IShip[]): string[][] {
    if (!ships) {
      console.error('Ships es null o undefined.');
      return []; // Devuelve un tablero vacío si ships no está disponible
    }
  
    const board = Array(6).fill(null).map(() => Array(6).fill(''));
    ships.forEach(ship => {
        ship.cellsOccupied.forEach(cell => {
            const columnIndex = cell.column.charCodeAt(0) - 'A'.charCodeAt(0);
            const rowIndex = cell.row - 1; // Ajuste para alinearse con el backend
            board[rowIndex][columnIndex] = 'S';
        });
    });
    return board;
  }
  
  selectedRow: number | null = null;
  selectedColumn: number | null = null;
  selectedHitRow: number | null = null;
  selectedHitColumn: number | null = null;
  isHitAnimating: boolean = false;

  selectCell(row: number, column: number) {
    this.selectedRow = row;
    this.selectedColumn = column;
    const adjustedRow = row + 1;
    const columnLetter = String.fromCharCode(65 + column);

    this.mathleshipService.attackCell(adjustedRow, columnLetter).subscribe({
        next: (response) => {
            if (response.isHit) {
              //this.board[row][column] = 'H';
                this.generateMathOperation();
                this.mathVisible = true;
                console.log('Modal abierto, mathVisible:', this.mathVisible);
            } else {
              this.board[row][column] = 'M';
                console.log('No hay barco en esta casilla');
            }
        },
        error: (err) => console.error('Error selecting cell', err)
    });
}

  
  generateMathOperation() {
    this.number1 = Math.floor(Math.random() * 10) + 1;
    this.number2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*', '/'];
    this.operator = operators[Math.floor(Math.random() * operators.length)];
    console.log('Operación generada:', this.number1, this.operator, this.number2);

    if (this.operator === '/') {
      // Generar divisiones válidas
      while (this.number1 % this.number2 !== 0) {
        this.number1 = Math.floor(Math.random() * 10) + 1;
        this.number2 = Math.floor(Math.random() * 10) + 1;
      }
    }
  }

  submitAnswer(row: number, column: number) {
    let correctAnswer: number;
    switch (this.operator) {
      case '+':
        correctAnswer = this.number1 + this.number2;
        break;
      case '-':
        correctAnswer = this.number1 - this.number2;
        break;
      case '*':
        correctAnswer = this.number1 * this.number2;
        break;
      case '/':
        correctAnswer = this.number1 / this.number2;
        break;
      default:
        correctAnswer = 0;
    }
  
    const userAnswerNumber = parseFloat(this.userAnswer);
  
    if (userAnswerNumber === correctAnswer) {
      // Respuesta correcta: cerrar el modal y proceder con las animaciones.
      this.showFeedbackMessage(true);
  
      setTimeout(() => {
        // 1. Cerrar el modal.
        this.mathVisible = false;
        this.userAnswer = '';
  
        // 2. Reproducir la animación del GIF.
        this.selectedHitRow = row;
        this.selectedHitColumn = column;
        this.isHitAnimating = true;
  
        // 3. Después de la animación, muestra el borde rojo y circHit.png.
        setTimeout(() => {
          this.isHitAnimating = false; // Oculta el GIF.
          this.board[row][column] = 'H'; // Marca la celda como acertada.
        }, 2000); // Duración del GIF (ajusta según sea necesario).
      }, 1000); // Tiempo para cerrar el modal.
    } else {
      // Respuesta incorrecta: reinicia la celda y cierra el modal.
      this.showFeedbackMessage(false);
      setTimeout(() => {
        this.mathVisible = false;
        this.userAnswer = '';
        this.board[row][column] = ''; // Reinicia la celda.
        this.selectedRow = null;
        this.selectedColumn = null;
      }, 1000); // Tiempo para cerrar el modal.
    }
  }
  

  showFeedbackMessage(isCorrect: boolean) {
    if (isCorrect) {
      this.alertMessage = '¡Respuesta correcta! 🎉';
      this.alertType = 'success';
    } else {
      this.alertMessage = 'Respuesta incorrecta 😞';
      this.alertType = 'error';
    }
  
    // Mostrar el mensaje en el modal
    this.showAlert = true;
  
    // Ocultar el mensaje automáticamente después de 1 segundo
    setTimeout(() => {
      this.showAlert = false;
    }, 1000);
  }
  

  
  triggerAlert(type: 'time' | 'error' | 'success', title: string, message: string) {
    this.alertType = type;
    this.alertTitle = title;
    this.alertMessage = message;
    this.showAlert = true;
  }

  closeAlertModal() {
    this.showAlert = false;
  }

  closeMathModal() {
    this.mathVisible = false;
    this.showResult = false;
    this.userAnswer = '';
    this.resultMessage = '';
  }

}
