import { Component, NgModule,  ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyComponent } from '../../../components/keyboard/key/key.component';
import { GamesKnoledgeBaseComponent } from '../../../components/game/games-knoledge-base/games-knoledge-base.component';
@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [
    KeyComponent,
    GamesKnoledgeBaseComponent,
    CommonModule
  ],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent {
  // Define una propiedad para almacenar el índice del texto a mostrar
  currentTextIndex: number = 0;

  // Método para actualizar el índice recibido desde el hijo
  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;
  }

}
