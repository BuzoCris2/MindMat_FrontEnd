import { Component } from '@angular/core';
import { BackgroundComponent } from "../background/background.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    BackgroundComponent,
    RouterOutlet,
    CommonModule],
    
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
