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
  number1: number = 0;
  number2: number = 0;
  operator: string = '';
  userAnswer: string = '';

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
  
  

  selectCell(row: number, column: number) {
    const adjustedRow = row + 1;
    const columnLetter = String.fromCharCode(65 + column);

    this.mathleshipService.attackCell(adjustedRow, columnLetter).subscribe({
        next: (response) => {
            if (response.isHit) {
                this.generateMathOperation();
                this.mathVisible = true;
            } else {
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
  }

  submitAnswer() {
    let correctAnswer;
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
    }

    if (parseFloat(this.userAnswer) === correctAnswer) {
      this.triggerAlert('success', '¡Correcto!', 'Respuesta correcta.');
    } else {
      this.triggerAlert('error', '¡Incorrecto!', 'Respuesta incorrecta.');
    }

    // Ocultar la operación después de enviar la respuesta
    this.mathVisible = false;
    this.userAnswer = '';
  }

  /*calculateAnswer(): number {
    switch (this.operator) {
      case '+': return this.firstOperand + this.secondOperand;
      case '-': return this.firstOperand - this.secondOperand;
      case '*': return this.firstOperand * this.secondOperand;
      case '/': return Math.floor(this.firstOperand / this.secondOperand); // División entera
      default: return 0;
    }
  }*/

  triggerAlert(type: 'time' | 'error' | 'success', title: string, message: string) {
    this.alertType = type;
    this.alertTitle = title;
    this.alertMessage = message;
    this.showAlert = true;
  }

  closeAlertModal() {
    this.showAlert = false;
  }
}
