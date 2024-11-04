import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  hovered: string | null = null;

  constructor(private router: Router) {}

  toggleHover(card: string) {
    this.hovered = this.hovered === card ? null : card;
  }

  navigateTo(page: string) {
    if (page === 'login') {
      this.router.navigate(['/login']);
    } else if (page === 'signup') {
      this.router.navigate(['/signup']);
    }
  }
}