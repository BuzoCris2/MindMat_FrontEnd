import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { Component, inject, Output, EventEmitter, Input, ElementRef, Renderer2, ViewChild, viewChild, OnInit, AfterViewInit } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { ModalService } from '../../../services/modal.service';
import { ScoreService } from '../../../services/score.service';
import { IScore } from '../../../interfaces';

@Component({
  selector: 'app-games-save-score',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent
  ],
  templateUrl: './games-save-score.component.html',
  styleUrl: './games-save-score.component.scss'
})
export class GamesSaveScoreComponent implements AfterViewInit {
  //public selectedGameId: number | null = null;
  public starsEarned: string = '';
  public elapsedTime: string = '';
  public scoreService: ScoreService = inject(ScoreService);
  public modalService: ModalService = inject(ModalService);
  
  scoreResponse: string = '';
  @ViewChild('scoreModal') public scoreModal: any;
  @ViewChild('keyboardScore') keyboarSection!: ElementRef<HTMLDivElement>;
  @ViewChild('colorScore') colorSection!: ElementRef<HTMLDivElement>;
  @ViewChild('mathleshipScore') mathleshipSection!:  ElementRef <HTMLDivElement>;
  @ViewChild('growTreeScore') growTreeSection!: ElementRef<HTMLDivElement>;
  @ViewChild('standardContinueButton') standardContinueButton!: ElementRef<HTMLDivElement>;
  @Output() calculationInit = new EventEmitter<number>();
  @Input() selectedGameId!: number;
  @Input() wrongAnswers!: number;
  @Input() correctAnswers!: number;
  @Input() startTime!: Date;
  @Input() maxTimeForFullStars!: number;
 
  constructor(
    private router: Router
  ) {}

  closeModal() {
 this.router.navigateByUrl('/app/user-dashboard');
 this.modalService.closeAll();
  }

  ngAfterViewInit() {
    if (this.selectedGameId == 1) {
      this.keyboarSection.nativeElement.classList.remove('display-none');
      let score: IScore = {
        rightAnswers: this.correctAnswers,
        wrongAnswers: this.wrongAnswers,
        game: {
          "id": 1,
          "name": "Key",
          "description": "GeneratedGame",
          "createdAt": "2024-11-16T00:10:20.000+00:00",
          "updatedAt": "2024-11-16T00:11:01.000+00:00"
        },
      }
      this.scoreService.save(score).subscribe({
        next: (response) => {
          this.starsEarned = response.stars;
          this.correctAnswers = response.rightAnswers;
        },
        error: (err) => {
          console.error('Error saving score:', err);
        }
      });
    } if (this.selectedGameId === 3) {
      const timeTaken = this.calculateElapsedTime();
      this.elapsedTime = this.calculateElapsedTime();
      this.mathleshipSection.nativeElement.classList.remove('display-none');
      const score: IScore = {
        rightAnswers: 0,
        wrongAnswers: 0,
        game: {
          id: 3,
          "name": "Mathleship",
          "description": "Juego basado en operaciones matemáticas.",
          "createdAt": "2024-11-29T00:10:20.000+00:00",
          "updatedAt": "2024-11-29T00:11:01.000+00:00"
        },
        timeTaken: timeTaken
      };
    
      this.scoreService.save(score).subscribe({
        next: (response) => {
          this.starsEarned = response.stars;
         },
        error: (err) => {
          console.error("Error guardando el puntaje:", err);
        }
      });
    }
    if (this.selectedGameId === 4) {
      const timeTaken = this.calculateElapsedTime();
      this.growTreeSection.nativeElement.classList.remove('display-none');
      const score: IScore = {
        rightAnswers: this.correctAnswers,
        wrongAnswers: this.wrongAnswers,
        game: {
          id: 4,
          name: "Grow Your Tree",
          description: "Juego basado en operaciones matemáticas.",
          createdAt: "2024-11-29T00:10:20.000+00:00",
          updatedAt: "2024-11-29T00:11:01.000+00:00"
        },
        timeTaken: timeTaken
      };
    
      this.scoreService.save(score).subscribe({
        next: (response) => {
          this.starsEarned = response.stars;
          this.correctAnswers = response.rightAnswers;
          this.wrongAnswers = response.wrongAnswers;
        },
        error: (err) => {
          console.error("Error guardando el puntaje:", err);
        }
      });
    }
     else if (this.selectedGameId == 5) {
      this.colorSection.nativeElement.classList.remove('display-none');
      this.standardContinueButton.nativeElement.classList.add('display-none');
      let score: IScore = {
        rightAnswers: this.correctAnswers,
        wrongAnswers: this.wrongAnswers,
        game: {
          "id": 5,
          "name": "Color",
          "description": "GeneratedGame",
          "createdAt": "2024-11-16T00:10:20.000+00:00",
          "updatedAt": "2024-11-16T00:11:01.000+00:00"
        },
      }
      this.scoreService.save(score).subscribe({
        next: (response) => {
          this.starsEarned = response.stars;
          this.correctAnswers = response.rightAnswers;
        },
        error: (err) => {
          console.error('Error saving score:', err);
        }
      });
    }
  }

  @Output() resetQuizEvent = new EventEmitter<void>();  // Evento para reiniciar el quiz
  @Output() unlockAllQuestionsEvent = new EventEmitter<void>();  // Evento para continuar


  // Método para emitir el evento de reinicio
  onResetQuiz() {
    this.resetQuizEvent.emit();  // Emite el evento
  }

  // Método para emitir el evento de continuar
  onUnlockAllQuestions() {
    this.unlockAllQuestionsEvent.emit();  // Emite el evento
  }

  calculateElapsedTime(): string {
    if (!this.startTime) {
        console.error("Start time no está definido.");
        return "00:00:00";
    }
    const endTime = new Date();
    const elapsedTime = Math.floor((endTime.getTime() - this.startTime.getTime()) / 1000);
    return new Date(elapsedTime * 1000).toISOString().substr(11, 8);
  }

  parseStarsEarned(stars: string): number {
    return parseInt(stars, 10) || 0; // Convierte el string a número solo en esta función
}

}
