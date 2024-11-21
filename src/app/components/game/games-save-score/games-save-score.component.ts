import {Component, inject, Output, EventEmitter, Input, ElementRef, Renderer2, ViewChild, viewChild} from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-games-save-score',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './games-save-score.component.html',
  styleUrl: './games-save-score.component.scss'
})
export class GamesSaveScoreComponent {

}
