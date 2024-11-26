import {Component, ElementRef, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-key',
  standalone: true,
  imports: [],
  templateUrl: './key.component.html',
  styleUrl: './key.component.scss'
})
export class KeyComponent {
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() soundSource: string = '';
  @Input() status: string = '';
  @Input() backgroundColor: string = '';
  @Input() color: string = '';
  @Input() tone: string = '';
  
  playNote(note: string){
    let sound = new Audio("../assets/audio/keyboard/"+note+".mp3");
    sound.play();
  }

  /*
  ngOnInit(): void {
    
    if (this.status == 'blocked'){
      this.key.nativeElement.disabled = true;
    }
}*/
}
