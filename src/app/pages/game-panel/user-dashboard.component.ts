import { Component } from '@angular/core';
import { Game } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {
  categories = ['Ciencia', 'Tecnología', 'Ingeniería', 'Arte', 'Matemática'];
  games: Game[] = [
    { id: 1, name: 'Mathleship', categories: ['Matemática'], route: '/app/mathleship' },
    { id: 2, name: 'Tablero Musical', categories: ['Matemática'], route: '/app/keyboard' },
    { id: 3, name: 'Tablero Musical', categories: ['Arte'], route: '/app/keyboard' },
    { id: 4, name: 'Color Game', categories: ['Arte'], route: '/app/colorgame' },
    { id: 5, name: 'Color Game', categories: ['Ciencia'], route: '/app/colorgame' },
  ];
  selectedCategoryGames: Game[] = [];
  showGameList: boolean = false;

  constructor(private router: Router) {}

  selectCategory(category: string): void {
    this.selectedCategoryGames = this.games.filter(game => game.categories.includes(category));
    this.showGameList = true;
  }
  

  playGame(gameRoute: string): void {
    this.router.navigate([gameRoute]); // Redirige a la ruta del juego
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'Ciencia': return 'var(--color-verde)';
      case 'Tecnología': return 'var(--color-azul)';
      case 'Ingeniería': return 'var(--color-naranja)';
      case 'Arte': return 'var(--color-amarillo)';
      case 'Matemática': return 'var(--color-rojo)';
      default: return '#FFFFFF';
    }
  }
}
