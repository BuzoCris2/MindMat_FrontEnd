import { Component, OnInit } from '@angular/core';
import { MathleshipService } from '../../services/mathleship.service';
import { TimerComponent } from '../../components/timer/timer.component';
import { CommonModule } from '@angular/common';
import { IShip, IGridCell } from '../../interfaces';

@Component({
  selector: 'app-mathleship',
  standalone: true,
  templateUrl: './mathleship.component.html',
  styleUrls: ['./mathleship.component.scss'],
  imports: [CommonModule, TimerComponent]
})
export class MathleshipComponent implements OnInit {
  //board: string[][] = Array.from({ length: 6 }, () => Array(6).fill(''));
  board: string[][] = [];
  timerValue: string = '03:00'; // Valor inicial del temporizador

  constructor(private mathleshipService: MathleshipService) {}

  ngOnInit(): void {
    // Inicializar el tablero y otros valores
    this.initializeGame();
  }

  initializeGame() {
    this.mathleshipService.initializeBoard().subscribe({
      next: (data: IShip[]) => {
        // Procesa los datos de barcos para construir el tablero
        this.board = this.buildBoard(data);
      },
      error: (err) => console.error('Error initializing game', err)
    });
  }

  buildBoard(ships: IShip[]): string[][] {
    // Inicializa un tablero vacío de 6x6
    const board = Array.from({ length: 6 }, () => Array(6).fill(''));

    // Coloca los barcos en el tablero basado en los datos del backend
    ships.forEach((ship: IShip) => {
      ship.cellsOccupied.forEach((cell: IGridCell) => {
        const row = cell.row;
        const col = cell.column.charCodeAt(0) - 'A'.charCodeAt(0); // Convierte columna de 'A'-'F' a índice 0-5
        board[row][col] = 'S'; // Usa 'S' para indicar una celda con barco
      });
    });

    return board;
  }

  selectCell(row: number, column: number) {
    // Lógica para seleccionar una celda y enviar al servicio
    this.mathleshipService.attackCell(row, column).subscribe({
      next: (response) => {
        // Maneja la respuesta del ataque aquí
      },
      error: (err) => console.error('Error selecting cell', err)
    });
  }
}
