import {Component, inject, Output, EventEmitter, Input, ElementRef, Renderer2, ViewChild, viewChild} from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { ModalService } from '../../../services/modal.service';
@Component({
  selector: 'app-games-knoledge-base',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './games-knoledge-base.component.html',
  styleUrl: './games-knoledge-base.component.scss'
})
export class GamesKnoledgeBaseComponent {
  // EventEmitter para enviar el índice de texto al componente padre
  public modalService: ModalService = inject(ModalService);
  @Input() numberOfPages: number = 1;
  @Output() gameStart = new EventEmitter<void>(); 
  @Output() textIndexChange = new EventEmitter<number>();
  @ViewChild('navigationPanel') panel!: ElementRef;
  @ViewChild('nextPage') next!: ElementRef; 
  @ViewChild('previousPage') previous!: ElementRef; 
  @ViewChild('sendPage') send!: ElementRef;
  @ViewChild('addTestModal') public addTestModal: any;
  public currentIndex: number = 0;
  
  // Método para cambiar el índice y emitirlo al padre
  checkButton(){
    console.log(this.currentIndex);
    if(this.currentIndex == 0){
      this.previous.nativeElement.disabled = true;
    }
    if(this.currentIndex == this.numberOfPages-2){
      this.next.nativeElement.classList.add('display-none');
      this.send.nativeElement.classList.remove('display-none');
    }else{
      this.next.nativeElement.classList.remove('display-none');
      this.send.nativeElement.classList.add('display-none');
    }
    if(this.currentIndex == this.numberOfPages-1){
      this.panel.nativeElement.classList.add('display-none');
      this.modalService.closeAll();
    }
  }

  nextItem() {
    if(this.currentIndex < this.numberOfPages-1){
      this.currentIndex = (this.currentIndex + 1) % this.numberOfPages;
      this.textIndexChange.emit(this.currentIndex);
      this.previous.nativeElement.disabled = false; // Emite el nuevo índice al padre
      this.checkButton();
    }
  }

  previousItem(){
    if(this.currentIndex > 0){
      this.currentIndex = (this.currentIndex - 1) % this.numberOfPages;
      this.textIndexChange.emit(this.currentIndex);
      this.checkButton();
    }
  }

  popUpGame(){
    this.modalService.displayModal('md', this.addTestModal);
  }
  
  startGame() {
    this.gameStart.emit(); // Notificar al padre que el juego ha comenzado
    this.modalService.closeAll();
  }

  cancelGame(){
    this.modalService.closeAll();
  }


}
