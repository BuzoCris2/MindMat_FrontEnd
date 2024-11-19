import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-programminggame',
  templateUrl: './programminggame.component.html',
  styleUrls: ['./programminggame.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class ProgrammingGameComponent {
  currentTextIndex: number = 0;

  grid: number[] = Array(25).fill(0); // Tablero 5x5
  roverPosition: number = 0; // Posición inicial de Rover
  flagPosition: number = 24; // Posición de la nave
  obstacles: number[] = [6, 7, 12, 17]; // Obstáculos
  commands: string[] = []; // Lista de comandos arrastrados
  direction: string = 'right'; // Dirección inicial (right, down, left, up)

  updateTextIndex(newIndex: number): void {
    this.currentTextIndex = newIndex;
  }

  drag(event: DragEvent, command: string): void {
    event.dataTransfer?.setData('command', command);
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    const command = event.dataTransfer?.getData('command');
    if (command) {
      this.commands.push(command);
    }
  }

  executeCommands(): void {
    for (let command of this.commands) {
      if (command === 'move') this.moveRover();
      else if (command === 'left') this.turnLeft();
      else if (command === 'right') this.turnRight();

      if (this.roverPosition === this.flagPosition) {
        this.currentTextIndex = 2; // Ganaste
        return;
      }
    }

    this.commands = []; // Limpia los comandos después de ejecutarlos
  }

  moveRover(): void {
    let newPosition = this.roverPosition;
    if (this.direction === 'right') newPosition++;
    else if (this.direction === 'down') newPosition += 5;
    else if (this.direction === 'left') newPosition--;
    else if (this.direction === 'up') newPosition -= 5;

    if (!this.obstacles.includes(newPosition) && newPosition >= 0 && newPosition < 25) {
      this.roverPosition = newPosition;
    }
  }

  turnLeft(): void {
    const directions = ['up', 'left', 'down', 'right'];
    const currentIndex = directions.indexOf(this.direction);
    this.direction = directions[(currentIndex + 1) % 4];
  }

  turnRight(): void {
    const directions = ['up', 'right', 'down', 'left'];
    const currentIndex = directions.indexOf(this.direction);
    this.direction = directions[(currentIndex + 1) % 4];
  }

  resetGame(): void {
    this.currentTextIndex = 0;
    this.roverPosition = 0;
    this.commands = [];
  }
}
