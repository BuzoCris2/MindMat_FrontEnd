import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-programminggame',
  templateUrl: './programminggame.component.html',
  styleUrls: ['./programminggame.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ProgrammingGameComponent {
  currentTextIndex: number = 0;
  grid: number[] = Array(25).fill(0); // Tablero de 5x5
  roverPosition: number = 0; // Posición inicial de Rover
  flagPosition: number = 24; // Posición de la meta
  obstacles: number[] = [6, 7, 12, 17]; // Obstáculos en el tablero
  commands: string[] = []; // Lista de comandos seleccionados
  direction: string = 'right'; // Dirección inicial de Rover
  lives: number[] = [1, 1, 1]; // Tres vidas iniciales
  isHitAnimating: boolean = false; // Controla si se muestra la animación
  showLifeMessage: boolean = false;
  explosionPosition: number | null = null; // Inicializamos explosionPosition como null

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

      if (this.lives.length === 0) {
        alert('¡Perdiste todas tus vidas! Intenta de nuevo.');
        this.resetGame();
        return;
      }

      if (this.roverPosition === this.flagPosition) {
        setTimeout(() => {
          this.currentTextIndex = 2; // Pantalla de nivel completado
        }, 500);
        return;
      }
    }

    this.commands = []; // Limpiar comandos
  }

  moveRover(): void {
    let newPosition = this.roverPosition;
    if (this.direction === 'right') newPosition++;
    else if (this.direction === 'down') newPosition += 5;
    else if (this.direction === 'left') newPosition--;
    else if (this.direction === 'up') newPosition -= 5;

    if (newPosition >= 0 && newPosition < 25) {
      this.roverPosition = newPosition;

      if (this.obstacles.includes(newPosition)) {
        this.triggerExplosion(newPosition);
        this.loseLife();
      }
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

  triggerExplosion(position: number): void {
    this.explosionPosition = position;
    this.isHitAnimating = true;

    // Quita el obstáculo después de 1 segundo
    setTimeout(() => {
      this.obstacles = this.obstacles.filter((obstacle) => obstacle !== position);
      this.isHitAnimating = false;
      this.explosionPosition = null; // Limpia la posición de la explosión
    }, 1000);
  }

  loseLife(): void {
    this.showLifeMessage = true;

    setTimeout(() => {
      this.showLifeMessage = false;
    }, 3000); // Muestra el mensaje durante 3 segundos

    this.lives.pop(); // Elimina una vida

    if (this.lives.length === 0) {
      setTimeout(() => {
        this.resetGame();
      }, 1000);
    }
  }

  resetGame(): void {
    this.currentTextIndex = 0;
    this.roverPosition = 0;
    this.commands = [];
    this.lives = [1, 1, 1];
    this.obstacles = [6, 7, 12, 17]; // Reinicia los obstáculos
    this.explosionPosition = null;
    this.isHitAnimating = false;
  }
}
