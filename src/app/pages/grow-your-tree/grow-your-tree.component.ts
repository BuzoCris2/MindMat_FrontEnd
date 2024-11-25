import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesKnoledgeBaseComponent } from '../../components/game/games-knoledge-base/games-knoledge-base.component';

@Component({
  selector: 'app-grow-your-tree',
  standalone: true,
  imports: [CommonModule,
    GamesKnoledgeBaseComponent],
  templateUrl: './grow-your-tree.component.html',
  styleUrl: './grow-your-tree.component.scss'
})
export class GrowYourTreeComponent {
  currentTextIndex: number = 0;

  // Método para actualizar el índice recibido desde el hijo
  updateTextIndex(newIndex: number) {
    this.currentTextIndex = newIndex;
}

}