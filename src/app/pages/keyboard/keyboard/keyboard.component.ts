import { Component } from '@angular/core';
import { KeyComponent } from '../../../components/keyboard/key/key.component';
@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [
    KeyComponent
  ],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent {

}
