import { Component, OnInit } from '@angular/core';
import { MathleshipService } from '../../services/mathleship.service';
import { TimerComponent } from '../../components/timer/timer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IShip, IGridCell } from '../../interfaces';
import { AlertModalComponent } from '../../components/alert/alert-modal.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-mathleship',
  standalone: true,
  templateUrl: './mathleship.component.html',
  styleUrls: ['./mathleship.component.scss'],
  imports: [CommonModule, FormsModule, TimerComponent, AlertModalComponent]
})
export class MathleshipComponent implements OnInit {
  board: string[][] = [];
  timerValue: string = '03:00';
  shipsStatus: { [key: string]: boolean } = {};
  ships: IShip[] = [];

  showAlert = false;
  alertType: 'time' | 'error' | 'success' = 'success';
  alertTitle = '¡Éxito!';
  alertMessage = 'Campo avatarId actualizado con éxito';
  alertButtonText = 'Cerrar';

  quickFeedbackVisible: boolean = false;
  quickFeedbackMessage: string = '';
  quickFeedbackType: 'success' | 'error' = 'success';

  mathVisible = false;
  showResult = false;
  number1: number = 0;
  number2: number = 0;
  operator: string = '';
  userAnswer: string = '';
  resultMessage: string = '';

  powerups = [
    { name: 'Row Shot', used: false },
    { name: 'Column Shot', used: false },
    { name: 'Cross Shot', used: false }
  ];
  selectedPowerup: number | null = null;

  selectedColumnHover: number | null = null;
  lastSelectedColumn: number | null = null;

  selectedRowHover: number | null = null;
  lastSelectedRow: number | null = null;

  constructor(private mathleshipService: MathleshipService, private cdr: ChangeDetectorRef) {}

  /*ngOnInit(): void {
    this.initializeGame();

    this.mathleshipService.getShips().subscribe({
  next: (response) => {
    console.log('Datos recibidos de los barcos:', response);
    if (response) {  
      this.board = this.buildBoard(response);
      this.initializeShipsStatus(response);
      
    } else {
      console.error('No se recibieron datos de los barcos.');
    }
  },
  error: (err) => console.error('Error al obtener los barcos', err)
});

  }*/

ngOnInit(): void {
  this.mathleshipService.initializeBoard().subscribe({
    next: (ships: IShip[]) => {
      console.log('Datos de barcos recibidos desde el backend:', ships);

      this.ships = ships; // Guardar barcos localmente
      this.board = this.buildBoard(ships); // Construir el tablero
      this.initializeShipsStatus(ships); // Inicializar el estado de los barcos
    },
    error: (err) => {
      console.error('Error al inicializar el tablero:', err);
    },
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

  initializeShipsStatus(ships: IShip[]): void {
    this.ships = ships;
    ships.forEach((ship, index) => {
      this.shipsStatus[`ship${index + 1}`] = false; // Todos los barcos inician como no derribados
      
    });
    console.log('Datos de barcos inicializados:', this.ships);
  }

  checkShipStatus(): void {
    this.ships.forEach((ship, index) => {
      const allHit = ship.cellsOccupied.every((cell) => {
        const row = cell.row - 1;
        const col = cell.column.charCodeAt(0) - 'A'.charCodeAt(0);
        return this.board[row][col] === 'H'; // Todas las celdas deben estar marcadas como golpeadas
      });
  
      // Si todas las celdas de un barco están golpeadas, marcar el barco como destruido
      if (allHit) {
        this.shipsStatus[`ship${index + 1}`] = true;
      }
    });
  
    console.log('Estado actualizado de los barcos:', this.shipsStatus);
  }
  

  buildBoard(ships: IShip[]): string[][] {
    if (!ships) {
      console.error('Ships es null o undefined.');
      return [];
    }
  
    //const board = Array(6).fill(null).map(() => Array(6).fill(''));
    const board = Array.from({ length: 6 }, () => Array(6).fill(''));
    ships.forEach(ship => {
        ship.cellsOccupied.forEach(cell => {
            const columnIndex = cell.column.charCodeAt(0) - 'A'.charCodeAt(0);
            const rowIndex = cell.row - 1;

            if (board[rowIndex][columnIndex] === 'S') {
              console.warn(
                `Posición duplicada detectada: (${rowIndex + 1}, ${cell.column})`
              );
            }

            board[rowIndex][columnIndex] = 'S';
        });
    });
    console.log('Tablero construido:', board);
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
    const correctAnswer = this.calculateCorrectAnswer();
    const userAnswerNumber = parseFloat(this.userAnswer);
  
    if (userAnswerNumber === correctAnswer) {
      this.showFeedbackMessage(true);
  
      setTimeout(() => {
        this.mathVisible = false;
        this.userAnswer = '';
        this.selectedHitRow = row;
        this.selectedHitColumn = column;
        this.isHitAnimating = true;
  
        setTimeout(() => {
          this.isHitAnimating = false;
          this.board[row][column] = 'H'; // Marcar hit
          this.checkShipStatus();
        }, 2000); 
      }, 1000);
    } else {
      this.showFeedbackMessage(false);
      setTimeout(() => {
        this.mathVisible = false;
        this.userAnswer = '';
        this.board[row][column] = ''; // Reiniciar celda
        this.selectedRow = null;
        this.selectedColumn = null;
      }, 1000);
    }
  }
  
  showFeedbackMessage(isCorrect: boolean) {
    if (isCorrect) {
      this.quickFeedbackMessage = '¡Respuesta correcta! 🎉';
      this.quickFeedbackType = 'success';
    } else {
      this.quickFeedbackMessage = 'Respuesta incorrecta 😞';
      this.quickFeedbackType = 'error';
    }
  
    this.quickFeedbackVisible = true;
  
    // Oculta el feedback después de 1 segundo
    setTimeout(() => {
      this.quickFeedbackVisible = false;
    }, 1000);
  }  
  
  triggerAlert(type: 'time' | 'error' | 'success', title: string, message: string, buttonText: string = 'Cerrar') {
    this.alertType = type;
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertButtonText = buttonText;
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

  selectPowerup(index: number) {
    if (index < 0 || index >= this.powerups.length) {
      console.error('Índice de PowerUp no válido:', index);
      this.triggerAlert('error', 'Error', 'PowerUp no válido seleccionado.', 'Cerrar');
      return;
    }
    if (!this.powerups[index].used) {
      this.selectedPowerup = index; // Guardamos el índice del PowerUp seleccionado
      console.log('PowerUp seleccionado:', this.powerups[index].name);
    } else {
      console.log('Intentaste seleccionar un PowerUp ya usado:', this.powerups[index]);
      this.triggerAlert('error', 'Nada es para siempre', 'Ya utilizaste este PowerUp', 'Continuar');
    }
  }

  getPowerupImage(index: number): string {
    const images = [
      'assets/img/mathleship/puFila.png',     // Imagen del primer PowerUp
      'assets/img/mathleship/puColumna.png',  // Imagen del segundo PowerUp
      'assets/img/mathleship/puCruz.png',     // Imagen del tercer PowerUp
    ];
    return images[index];
  }

  usePowerup(index: number): void {
    this.powerups[index].used = true;
    console.log(`PowerUp ${index} marcado como usado.`);
  }
  
  hoverColumn(column: number) {
    if (this.selectedPowerup === 0) {
      this.selectedColumnHover = column;
    }
  }
  
  leaveColumn() {
    if (this.selectedPowerup === 0) {
      this.selectedColumnHover = null;
    }
  }

  hoverRow(row: number) {
    if (this.selectedPowerup === 1) {
      this.selectedRowHover = row; // Resalta la fila al hacer hover
    }
  }
  
  leaveRow() {
    if (this.selectedPowerup === 1) {
      this.selectedRowHover = null; // Limpia el hover de la fila
    }
  }  

  hoverCross(row: number, column: number) {
    if (this.selectedPowerup === 2) {
      // Guarda las posiciones afectadas por el PowerUp de cruz
      const affectedPositions = this.getAffectedPositions(row, column);
  
      // Aplica clases visuales a las celdas afectadas
      affectedPositions.forEach(([r, c]) => {
        const cell = document.querySelector(`.board-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
          cell.classList.add('hover-cross');
        }
      });
    }
  }
  
  leaveCross(row: number, column: number) {
    if (this.selectedPowerup === 2) {
      // Guarda las posiciones afectadas por el PowerUp de cruz
      const affectedPositions = this.getAffectedPositions(row, column);
  
      // Remueve clases visuales de las celdas afectadas
      affectedPositions.forEach(([r, c]) => {
        const cell = document.querySelector(`.board-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
          cell.classList.remove('hover-cross');
        }
      });
    }
  }  

  isCrossHovered(row: number, column: number): boolean {
    if (this.selectedPowerup !== 2 || this.selectedRow === null || this.selectedColumn === null) {
      return false;
    }
    const affectedPositions = this.getAffectedPositions(this.selectedRow, this.selectedColumn);
    return affectedPositions.some(([r, c]) => r === row && c === column);
  }
  
  
  
  activateColumnPowerup(column: number) {
    console.log('Intentando activar PowerUp para la columna:', column);
  
    if (this.selectedPowerup !== 0 || this.powerups[0].used) {
      console.log('PowerUp no activado. No es el seleccionado o ya fue usado.');
      return; // Verifica que el PowerUp no se ha usado y es el correcto
    }
  
    /*const hasShip = this.board.some(row => row[column] === 'S'); // Verifica si hay barcos
    console.log('¿Hay barcos en la columna seleccionada?', hasShip);
  
    if (hasShip) {
      console.log('Barcos encontrados en la columna. Generando operación matemática...');
      this.generateMathOperation(); // Genera operación matemática
      this.mathVisible = true; // Muestra el modal
      this.selectedColumnHover = column; // Guarda la columna seleccionada
      this.lastSelectedColumn = column;
      console.log('Columna seleccionada guardada:', this.selectedColumnHover);
    } else {
      console.log('No se encontraron barcos en la columna seleccionada.');
      this.alertType = 'error';
      this.alertMessage = 'No hay barcos en esta columna.';
      setTimeout(() => (this.alertMessage = ''), 2000);
    }*/

    console.log('Generando operación matemática para la columna seleccionada...');
    this.generateMathOperation(); // Genera operación matemática
    this.mathVisible = true; // Muestra el modal
    this.selectedColumnHover = column; // Guarda la columna seleccionada
    this.lastSelectedColumn = column;
    console.log('Columna seleccionada guardada:', this.selectedColumnHover);
  }  
  
  submitAnswerForColumn(column: number | null) {
    console.log('Intentando resolver la operación para la columna:', column);
    const correctAnswer = this.calculateCorrectAnswer(); // Calcula la respuesta correcta
    console.log('Respuesta correcta calculada:', correctAnswer);
    const userAnswerNumber = parseFloat(this.userAnswer); // Convierte la respuesta del usuario a número
    console.log('Respuesta del usuario:', userAnswerNumber);
    
    if (column === null || column === undefined) {
      column = this.lastSelectedColumn; // Usamos la última columna seleccionada
    }
  
    if (userAnswerNumber === correctAnswer) {
      console.log('Respuesta correcta. Aplicando PowerUp...');
      // Aplica los efectos del PowerUp
      console.log('Tablero antes de aplicar PowerUp:', this.board);
      this.board.forEach((row, rowIndex) => {
        if (row[column!] === 'S') {
          row[column!] = 'H'; // Marca como hit si hay barco
          console.log(`Celda [${rowIndex}, ${column}] marcada como "Hit".`);
        } else if (row[column!] === '') {
          row[column!] = 'M'; // Marca como miss si no hay barco
          console.log(`Celda [${rowIndex}, ${column}] marcada como "Miss".`);
        }
      });
      console.log('Tablero después de aplicar PowerUp:', this.board);

      this.checkShipStatus();
  
      // Feedback en el modal
      this.showFeedbackMessage(true); // Muestra el mensaje en el modal
      this.powerups[0].used = true; // Marca el PowerUp como usado
      this.selectedPowerup = null; // Resetea el PowerUp seleccionado
      this.selectedColumnHover = null; // Limpia el hover de columna
  
      // Cierra el modal después de 2 segundos
      setTimeout(() => {
        console.log('Cerrando modal después de usar el PowerUp...');
        this.closeMathModal(); // Cierra el modal
      }, 800);
    } else {
      console.log('Respuesta incorrecta. Mostrando feedback de error.');
      // Feedback en el modal en caso de error
      this.showFeedbackMessage(false);
      this.powerups[0].used = true; // Marca el PowerUp como usado
      this.selectedPowerup = null; // Resetea el PowerUp seleccionado
      this.selectedColumnHover = null;
      setTimeout(() => {
        console.log('Cerrando modal por respuesta incorrecta...');
        this.closeMathModal();
      }, 900);
    }
  }

  activateRowPowerup(row: number) {
    console.log('Intentando activar PowerUp para la fila:', row);
  
    if (this.selectedPowerup !== 1 || this.powerups[1].used) {
      console.log('PowerUp no activado. No es el seleccionado o ya fue usado.');
      return; // Verifica que el PowerUp no se ha usado y es el correcto
    }
  
    /*const hasShip = this.board[row].some((cell) => cell === 'S'); // CORRECTO
    console.log('¿Hay barcos en la fila seleccionada?', hasShip);
  
    if (hasShip) {
      console.log('Barcos encontrados en la fila. Generando operación matemática...');
      this.generateMathOperation(); // Genera operación matemática
      this.mathVisible = true; // Muestra el modal
      this.selectedRowHover = row; // Guarda la fila seleccionada
      this.lastSelectedRow = row;
      console.log('Fila seleccionada guardada:', this.selectedRowHover);
    } else {
      console.log('No se encontraron barcos en la fila seleccionada.');
      this.alertType = 'error';
      this.alertMessage = 'No hay barcos en esta fila.';
      setTimeout(() => (this.alertMessage = ''), 2000);
    }*/

      console.log('Generando operación matemática para la fila seleccionada...');
      this.generateMathOperation(); // Genera operación matemática
      this.mathVisible = true; // Muestra el modal
      this.selectedRowHover = row; // Guarda la fila seleccionada
      this.lastSelectedRow = row;
      console.log('Fila seleccionada guardada:', this.selectedRowHover);
  }
  
  submitAnswerForRow(row: number | null) {
    console.log('Intentando resolver la operación para la fila:', row);
    const correctAnswer = this.calculateCorrectAnswer(); // Calcula la respuesta correcta
    console.log('Respuesta correcta calculada:', correctAnswer);
    const userAnswerNumber = parseFloat(this.userAnswer); // Convierte la respuesta del usuario a número
    console.log('Respuesta del usuario:', userAnswerNumber);
  
    if (row === null || row === undefined) {
      row = this.lastSelectedRow; // Usamos la última fila seleccionada
    }

    if (row === null || row < 0 || row >= this.board.length) {
      console.error('Índice de fila no válido o fuera de rango:', row);
      return;
    }
  
    if (userAnswerNumber === correctAnswer) {
      console.log('Respuesta correcta. Aplicando PowerUp...');
      // Aplica los efectos del PowerUp
      console.log('Tablero antes de aplicar PowerUp:', this.board);
      this.board[row!].forEach((cell, columnIndex) => {
        if (cell === 'S') {
          this.board[row!][columnIndex] = 'H'; // Marca como hit si hay barco
          console.log(`Celda [${row}, ${columnIndex}] marcada como "Hit".`);
        } else if (cell === '') {
          this.board[row!][columnIndex] = 'M'; // Marca como miss si no hay barco
          console.log(`Celda [${row}, ${columnIndex}] marcada como "Miss".`);
        }
      });
      console.log('Tablero después de aplicar PowerUp:', this.board);

      this.checkShipStatus();
  
      // Feedback en el modal
      this.showFeedbackMessage(true); // Muestra el mensaje en el modal
      this.powerups[1].used = true; // Marca el PowerUp como usado
      this.selectedPowerup = null; // Resetea el PowerUp seleccionado
      this.selectedRowHover = null; // Limpia la fila seleccionada
  
      // Cierra el modal después de 2 segundos
      setTimeout(() => {
        console.log('Cerrando modal después de usar el PowerUp...');
        this.closeMathModal(); // Cierra el modal
      }, 800);
    } else {
      console.log('Respuesta incorrecta. Mostrando feedback de error.');
      // Feedback en el modal en caso de error
      this.showFeedbackMessage(false);
      this.powerups[1].used = true; // Marca el PowerUp como usado
      this.selectedPowerup = null; // Resetea el PowerUp seleccionado
      this.selectedRowHover = null;
      setTimeout(() => {
        console.log('Cerrando modal por respuesta incorrecta...');
        this.closeMathModal();
      }, 900);
    }
  }  

  activateCrossPowerup(row: number, column: number) {
    console.log('Intentando activar PowerUp de cruz en la casilla:', row, column);
  
    if (this.selectedPowerup !== 2 || this.powerups[2].used) {
      console.log('PowerUp no activado. No es el seleccionado o ya fue usado.');
      return; // Verifica que el PowerUp no se ha usado y es el correcto
    }
  
    // Validar si hay barcos en alguna de las casillas afectadas
    /*const affectedPositions = this.getAffectedPositions(row, column);
    const hasShip = affectedPositions.some(
      ([r, c]) => this.board[r] && this.board[r][c] === 'S'
    );
  
    console.log('¿Hay barcos en las casillas afectadas?', hasShip);
  
    if (hasShip) {
      console.log('Barcos encontrados en las casillas. Generando operación matemática...');
      this.generateMathOperation(); // Genera operación matemática
      this.mathVisible = true; // Muestra el modal
      this.selectedRow = row;
      this.selectedColumn = column; // Guarda la posición seleccionada
      console.log('Casilla seleccionada guardada:', row, column);
    } else {
      console.log('No se encontraron barcos en las casillas afectadas.');
      this.triggerAlert(
        'error',
        'No hay barcos',
        'No hay barcos en las casillas afectadas por este PowerUp.',
        'Cerrar'
      );
    }*/

      console.log('Generando operación matemática para el PowerUp de cruz...');
      this.generateMathOperation(); // Genera operación matemática
      this.mathVisible = true; // Muestra el modal
      this.selectedRow = row;
      this.selectedColumn = column; // Guarda la posición seleccionada
      console.log('Casilla seleccionada guardada:', row, column);
  }
  
  getAffectedPositions(row: number, column: number): [number, number][] {
    const positions: [number, number][] = [
      [row, column],       // Centro
      [row - 1, column],   // Arriba
      [row + 1, column],   // Abajo
      [row, column - 1],   // Izquierda
      [row, column + 1],   // Derecha
    ];
  
    // Filtrar las posiciones válidas (dentro del tablero)
    return positions.filter(
      ([r, c]) => r >= 0 && r < this.board.length && c >= 0 && c < this.board[0].length
    );
  }

  submitAnswerForCross(row: number, column: number) {
    console.log('Intentando resolver la operación para la cruz en:', row, column);
    const correctAnswer = this.calculateCorrectAnswer();
    console.log('Respuesta correcta calculada:', correctAnswer);
    const userAnswerNumber = parseFloat(this.userAnswer);
    console.log('Respuesta del usuario:', userAnswerNumber);
  
    if (userAnswerNumber === correctAnswer) {
      console.log('Respuesta correcta. Aplicando PowerUp de cruz...');
      const affectedPositions = this.getAffectedPositions(row, column);
  
      // Aplica los efectos del PowerUp
      console.log('Tablero antes de aplicar PowerUp:', this.board);
      affectedPositions.forEach(([r, c]) => {
        if (this.board[r][c] === 'S') {
          this.board[r][c] = 'H'; // Marca como hit si hay barco
          console.log(`Celda [${r}, ${c}] marcada como "Hit".`);
        } else if (this.board[r][c] === '') {
          this.board[r][c] = 'M'; // Marca como miss si no hay barco
          console.log(`Celda [${r}, ${c}] marcada como "Miss".`);
        }
      });
      console.log('Tablero después de aplicar PowerUp:', this.board);

      this.checkShipStatus();
  
      // Feedback en el modal
      this.showFeedbackMessage(true); // Muestra el mensaje en el modal
      this.powerups[2].used = true; // Marca el PowerUp como usado
      this.selectedPowerup = null; // Resetea el PowerUp seleccionado
  
      // Cierra el modal después de 2 segundos
      setTimeout(() => {
        console.log('Cerrando modal después de usar el PowerUp...');
        this.closeMathModal(); // Cierra el modal
      }, 800);
    } else {
      console.log('Respuesta incorrecta. Mostrando feedback de error.');
      // Feedback en el modal en caso de error
      this.showFeedbackMessage(false);
      setTimeout(() => {
        console.log('Cerrando modal por respuesta incorrecta...');
        this.closeMathModal();
      }, 900);
    }
  }
  
  

  calculateCorrectAnswer(): number {
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
        correctAnswer = 0; // Fallback por si ocurre un error
    }
    console.log('Operación matemática:', `${this.number1} ${this.operator} ${this.number2} = ${correctAnswer}`);
    return correctAnswer;
  }
  
  

}
