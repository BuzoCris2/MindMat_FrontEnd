import { GamesSaveScoreComponent } from './../../../components/game/games-save-score/games-save-score.component';
import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyComponent } from '../../../components/keyboard/key/key.component';
import { GamesKnoledgeBaseComponent } from '../../../components/game/games-knoledge-base/games-knoledge-base.component';
import { ScoreService } from '../../../services/score.service';
import { ModalComponent } from '../../../components/modal/modal.component';
import { ModalService } from '../../../services/modal.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [
    CommonModule,
    KeyComponent,
    GamesKnoledgeBaseComponent,
    RouterLink,
    GamesSaveScoreComponent
  ],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent implements OnInit{
  public starsEarned: string = '';
  public scales= [
    {name: 'mayor', display: 'T - T - st - T - T - T - st', responseExpected: ['T', 'T', 'st', 'T', 'T', 'T', 'st']},
    {name: 'menor', display: 'T - st - T - T - st - T - T', responseExpected: ['T', 'st', 'T', 'T', 'st', 'T', 'T']},
    {name: 'mixolidia', display: 'T - T - st - T - T - st - T', responseExpected: ['T', 'T', 'st', 'T', 'T', 'st', 'T']}
  ];
  public scaleSelected = {name: '', display: '', responseExpected: ['']};
  public scalePlayed = [''];
  public scoreService: ScoreService = inject(ScoreService);
  public modalService: ModalService = inject(ModalService);
  lastKey: number = 0;
  selectedGame: number = 0;
  correctAnswers: number = 0;
  wrongAnwsers: number = 0;
  public keys = [
    {name: '1', value: 'C', backgroundColor: 'Red', color: 'white', status: 'toPlay', tone: '', customClass : ''},
    {name: '2', value: 'Csharp', backgroundColor: 'orangered', color: 'white', status: 'blocked', tone: '', customClass : ''},
    {name: '3', value: 'D', backgroundColor: 'gold', color: 'black', status: 'blocked', tone: '', customClass : ''},
    {name: '4', value: 'Dsharp', backgroundColor: 'GreenYellow', color: 'black', status: 'blocked', tone: '', customClass : ''},
    {name: '5', value: 'E', backgroundColor: 'limegreen', color: 'black', status: 'blocked', tone: '', customClass : ''},
    {name: '6', value: 'F', backgroundColor: 'MediumSpringGreen', color: 'black', status: 'blocked', tone: '', customClass : ''},
    {name: '7', value: 'Fsharp', backgroundColor: 'DeepSkyBlue', color: 'black', status: 'blocked', tone: '', customClass : ''},
    {name: '8', value: 'G', backgroundColor: 'DodgerBlue', color: 'black', status: 'blocked', tone: '', customClass : ''},
    {name: '9', value: 'Gsharp', backgroundColor: 'MediumSlateBlue', color: 'white', status: 'blocked', tone: '', customClass : ''},
    {name: '10', value: 'A', backgroundColor: 'RebeccaPurple', color: 'white', status: 'blocked', tone: '', customClass : ''},
    {name: '11', value: 'Asharp', backgroundColor: 'Purple', color: 'white', status: 'blocked', tone: '', customClass : ''},
    {name: '12', value: 'B', backgroundColor: 'darkred', color: 'white', status: 'blocked', tone: '', customClass : ''},
    {name: '13', value: 'C1', backgroundColor: 'brown', color: 'white', status: 'blocked', tone: '', customClass : ''}
  ];
  @ViewChild('scoreModal') public scoreModal: any;
  constructor(
    private router: Router
  ){
    this.selectedGame = 1;
  }
  ngOnInit(): void {
    let scale = Math.floor(Math.random() * 3);
    this.scaleSelected = this.scales[scale];
  }
  
  currentTextIndex: number = 0;
  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;
  }
  

  closeModal(){
    this.modalService.closeAll();
  }

  saveScore(correct: number, wrong: number){
    this.correctAnswers = correct;
    this.wrongAnwsers = wrong;
    this.selectedGame = 1;
    this.modalService.displayModal('md', this.scoreModal);

  }

  currentNote(key: string){
    let numberKey = Number(key);
    if(numberKey-1 >= this.lastKey ){
      this.keys[numberKey-1].customClass = 'played-note';
      this.lastKey = numberKey-1;
    }
    if(this.keys[numberKey-1].tone != ''){
      this.scalePlayed.push(this.keys[numberKey-1].tone);
    }
    for (let i = numberKey-2; i >= 0; i--) {
      this.keys[i].tone = '';
    }
    if(this.keys[numberKey-1].status == 'toPlay' && numberKey < this.keys.length-1){
      this.keys[numberKey].status='toPlay';
      this.keys[numberKey].tone='st';
      this.keys[numberKey+1].status='toPlay';
      this.keys[numberKey+1].tone='T';
    }else if(this.keys[numberKey-1].status == 'toPlay' && numberKey < this.keys.length){
      this.keys[numberKey].status='toPlay';
      this.keys[numberKey].tone='st';
    }else if(this.keys[numberKey-1].status == 'toPlay' && numberKey == this.keys.length){
      this.scalePlayed.splice(0, 1)
      this.verifyAnswers();
    }
  }

  verifyAnswers(){
    let correctCounter = 0;
    let wrongCounter = 0;
    for(let i = 0; i<this.scalePlayed.length; i++){
      if(this.scalePlayed[i] == this.scaleSelected.responseExpected[i]){
        correctCounter ++;
      }else {
        wrongCounter ++;
      }
    }
    let diferenceResponse = 0;
    if(this.scaleSelected.responseExpected.length > this.scalePlayed.length){
      diferenceResponse = this.scaleSelected.responseExpected.length - this.scalePlayed.length;
    }
    wrongCounter = wrongCounter + diferenceResponse;
    this.saveScore(correctCounter, wrongCounter);
  }
}
