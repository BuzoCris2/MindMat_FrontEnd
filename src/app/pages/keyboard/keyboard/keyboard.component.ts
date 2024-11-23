import { GamesSaveScoreComponent } from './../../../components/game/games-save-score/games-save-score.component';
import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyComponent } from '../../../components/keyboard/key/key.component';
import { GamesKnoledgeBaseComponent } from '../../../components/game/games-knoledge-base/games-knoledge-base.component';
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
    GamesSaveScoreComponent
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
    this.scoreModal.selectedGameId = 1;
    this.modalService.displayModal('md', this.scoreModal);
  }
}
