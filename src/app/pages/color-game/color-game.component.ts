// color-game-page.component.ts
import { Component } from '@angular/core';
import { StageOneComponent } from "../../components/colorGame/stage-one/stage-one.component";
import { StageTwoComponent } from "../../components/colorGame/stage-two/stage-two.component";
import { StageThreeComponent } from "../../components/colorGame/stage-three/stage-three.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-game',
  standalone: true,
  templateUrl: './color-game.component.html',
  styleUrls: ['./color-game.component.scss'],
  imports: [CommonModule, StageOneComponent, StageTwoComponent, StageThreeComponent]
})
export class ColorGamePageComponent {
  currentStage: number = 1;  // Para determinar qué etapa mostrar

  goToStage(stage: number) {
    this.currentStage = stage;
  }
}
