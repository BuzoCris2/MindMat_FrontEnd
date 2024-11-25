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
  public keys = [
    {name: '1', value: 'C', backgroundColor: 'Red', color: 'white'},
    {name: '2', value: 'Csharp', backgroundColor: 'orangered', color: 'white'},
    {name: '3', value: 'D', backgroundColor: 'gold', color: 'black'},
    {name: '4', value: 'Dsharp', backgroundColor: 'GreenYellow', color: 'black'},
    {name: '5', value: 'E', backgroundColor: 'limegreen', color: 'black'},
    {name: '6', value: 'F', backgroundColor: 'MediumSpringGreen', color: 'black'},
    {name: '7', value: 'Fsharp', backgroundColor: 'DeepSkyBlue', color: 'black'},
    {name: '8', value: 'G', backgroundColor: 'DodgerBlue', color: 'black'},
    {name: '9', value: 'Gsharp', backgroundColor: 'MediumSlateBlue', color: 'white'},
    {name: '10', value: 'A', backgroundColor: 'RebeccaPurple', color: 'white'},
    {name: '11', value: 'Asharp', backgroundColor: 'Purple', color: 'white'},
    {name: '12', value: 'B', backgroundColor: 'darkred', color: 'white'},
    {name: '13', value: 'C1', backgroundColor: 'brown', color: 'white'}
  ];
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
