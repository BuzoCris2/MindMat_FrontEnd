import { OnInit } from '@angular/core';
import { Component, inject, EventEmitter, NgModule,  ViewChild, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyComponent } from '../../../components/keyboard/key/key.component';
import { GamesKnoledgeBaseComponent } from '../../../components/game/games-knoledge-base/games-knoledge-base.component';
import { GamesSaveScoreComponent } from '../../../components/game/games-save-score/games-save-score.component';
import { IScore } from '../../../interfaces';
import { ScoreService } from '../../../services/score.service';
import { ModalComponent } from '../../../components/modal/modal.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [
    CommonModule,
    KeyComponent,
    GamesKnoledgeBaseComponent,
    GamesSaveScoreComponent,
    ModalComponent
  ],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent {
  public starsEarned: string = '';
  public scoreService: ScoreService = inject(ScoreService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('scoreModal') public scoreModal: any;
  currentTextIndex: number = 0;
  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;
  }
  
  closeModal(){
    this.modalService.closeAll();
  }

  saveScore(){
    let score: IScore ={
        rightAnswers: 10,
        wrongAnswers: 2,
        game: 	{
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
          this.modalService.displayModal('md', this.scoreModal);
      },
      error: (err) => {
          console.error('Error saving score:', err);
      }
  });
  }
}
