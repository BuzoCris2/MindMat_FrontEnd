import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammingGameService } from '../../services/ProgrammingGameService';
import { ModalService } from '../../services/modal.service';
import { GamesSaveScoreComponent } from '../../components/game/games-save-score/games-save-score.component';
import { AlertModalComponent } from '../../components/alert/alert-modal.component';
import { TimerComponent } from '../../components/timer/timer.component';
import { GamesKnoledgeBaseComponent } from './../../components/game/games-knoledge-base/games-knoledge-base.component';
import { AfterViewInit, ViewChild } from '@angular/core';



@Component({  
  selector: 'app-programminggame',
  templateUrl: './programminggame.component.html',
  styleUrls: ['./programminggame.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TimerComponent,
    GamesSaveScoreComponent,
    AlertModalComponent,
    GamesKnoledgeBaseComponent,
  ],
})

export class ProgrammingGameComponent implements OnInit, AfterViewInit {
  // Variables principales del juego
  grid: number[] = Array(25).fill(0); 
  roverPosition: number = 0; 
  flagPosition: number = 24; 
  obstacles: number[] = [6, 7, 12, 17]; 
  commands: string[] = []; 
  direction: string = 'right'; 
  lives: number[] = [1, 1, 1]; 
  isHitAnimating: boolean = false; 
  explosionPosition: number | null = null; 
  currentTextIndex: number = 0; 

  // Estados para popups
  showLifeMessage: boolean = false;
  showGameOverPopup: boolean = false;
  showCongratulationsPopup: boolean = false;

  @ViewChild(TimerComponent) timerComponent!: TimerComponent;

  ngAfterViewInit(): void {
    console.log('Temporizador inicializado:', this.timerComponent);
    this.timerComponent.startTimer(); // Inicia el temporizador al cargar el componente
  }


  // Variables relacionadas con la puntuación y el estado del juego
  public gameStartTime: Date = new Date();
  public starsEarned: number = 0;

  // Servicios inyectados
  public modalService: ModalService = inject(ModalService);
  public programmingGameService: ProgrammingGameService = inject(ProgrammingGameService);

  constructor() {}

  ngOnInit(): void {
    console.log('Juego Inicializado');
  
    // Validar posiciones iniciales
    if (this.roverPosition === this.flagPosition || this.obstacles.includes(this.roverPosition)) {
      console.error('Posiciones conflictivas en el tablero');
    }
  }
  
  // Función para actualizar el índice de pantallas introductorias
  updateTextIndex(newIndex: number): void {
    this.currentTextIndex = newIndex;
  }

  // Navegación entre pantallas introductorias (Barra inferior)
  navigateToPrevious(): void {
    if (this.currentTextIndex > 0) {
      this.currentTextIndex--;
    }
  }

  navigateToNext(): void {
    if (this.currentTextIndex < 3) {
      this.currentTextIndex++;
    }
  }

  // Métodos relacionados con el juego
  drag(event: DragEvent, command: string): void {
    event.dataTransfer?.setData('command', command);
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
    const dropzone = event.target as HTMLElement;
    dropzone.classList.add('dragover'); 
  }

  dragLeave(event: DragEvent): void {
    const dropzone = event.target as HTMLElement;
    dropzone.classList.remove('dragover'); 
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    const command = event.dataTransfer?.getData('command');
    if (command) {
      this.commands.push(command); 
    }
  }
  
  removeCommand(index: number): void {
    this.commands.splice(index, 1); 
  }

  //Método para avanzar al tablero de juego
  startGame(): void{
    this.currentTextIndex = 4;
  }

  // Método para regresar a las instrucciones
  goBackToInstructions(): void {
    this.currentTextIndex = 2; 
  }
  executeCommands(): void {
    this.commands.forEach((command) => {
      if (command === 'move') this.moveRover();
      if (command === 'left') this.turnLeft();
      if (command === 'right') this.turnRight();
    });
    this.checkGameStatus();
    this.commands = [];
  }

  
  moveRover(): void {
    let newPosition = this.roverPosition;
    if (this.direction === 'right') newPosition++;
    if (this.direction === 'down') newPosition += 5;
    if (this.direction === 'left') newPosition--;
    if (this.direction === 'up') newPosition -= 5;
  
    // Validar si la nueva posición está dentro de los límites
    if (newPosition >= 0 && newPosition < this.grid.length) {
      if (this.obstacles.includes(newPosition)) {
        this.triggerExplosion(newPosition); 
        this.loseLife(); 
      } else {
        this.roverPosition = newPosition; 
      }
    }
    this.updateGrid(); 
  }
  
  updateGrid(): void {
    this.grid = Array(25).fill(0); 
    this.grid[this.roverPosition] = 1; 
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
    setTimeout(() => {
      this.obstacles = this.obstacles.filter((obstacle) => obstacle !== position); 
      this.isHitAnimating = false; 
      this.explosionPosition = null; 
    }, 1000); 
  }
  

  loseLife(): void {
    this.lives.pop();
    if (this.lives.length === 0) {
      this.showGameOverPopup = true;
    }
  }

  checkGameStatus(): void {
    if (this.roverPosition === this.flagPosition) {
      this.showCongratulationsPopup = true; 
    }
  }

  restartGame(): void {
    this.resetGame(); // Reinicia el juego
    this.showCongratulationsPopup = false; // Cierra el popup de felicitaciones
    this.timerComponent.startTimer(); // Reinicia el temporizador
  }

  resetGame(): void {
    this.currentTextIndex = 0;
    this.roverPosition = 0;
    this.commands = [];
    this.lives = [1, 1, 1];
    this.obstacles = [6, 7, 12, 17];
    this.explosionPosition = null;
    this.isHitAnimating = false;
    this.validatePositions();

  }


  validatePositions(): void {
    if (this.roverPosition === this.flagPosition || this.obstacles.includes(this.roverPosition)) {
      console.error('Posiciones conflictivas en el tablero');
    }
  }


  onTimeRemaining(timeLeft: number): void {    
    console.log(`Tiempo restante: ${timeLeft} segundos`);
  }
  
  onTimerEnded(): void {    
    console.log('¡El tiempo se ha acabado!');
    this.triggerGameOverPopup();
  }
  
  
  triggerGameOverPopup(): void {
    this.showGameOverPopup = true;
  }
  
  

  closeLifeMessagePopup(): void {
    this.showLifeMessage = false;
  }

  closeGameOverPopup(): void {
    this.showGameOverPopup = false;
    this.resetGame();
  }
}
