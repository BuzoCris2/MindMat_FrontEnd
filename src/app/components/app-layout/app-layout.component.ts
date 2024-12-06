import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './elements/topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from "../auth/background/background.component";



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    BackgroundComponent
],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent {
isGameActive: any;
  
}
