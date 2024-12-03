import { CommonModule } from '@angular/common';
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
  public scoreService: ScoreService = inject(ScoreService);
  public modalService: ModalService = inject(ModalService);
  scoreResponse: string = '';
  @ViewChild('scoreModal') public scoreModal: any;
  @ViewChild('keyboardScore') keyboarSection!: ElementRef<HTMLDivElement>;
  @ViewChild('colorScore') colorSection!: ElementRef<HTMLDivElement>;
  @ViewChild('standardContinueButton') standardContinueButton!: ElementRef<HTMLDivElement>;
  @Output() calculationInit = new EventEmitter<number>();
  @Input() selectedGameId!: number;
  @Input() wrongAnswers!: number;
  @Input() correctAnswers!: number;
  closeModal() {
    this.modalService.closeAll();
  }

  ngAfterViewInit() {
    if (this.selectedGameId == 1) {
      console.log("enchó");
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
    } else if (this.selectedGameId == 5) {
      console.log("prapra");
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

  constructor() {}

  // Método para emitir el evento de reinicio
  onResetQuiz() {
    this.resetQuizEvent.emit();  // Emite el evento
  }

  // Método para emitir el evento de continuar
  onUnlockAllQuestions() {
    this.unlockAllQuestionsEvent.emit();  // Emite el evento
  }
}
