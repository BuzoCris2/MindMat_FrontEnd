import { Component, inject } from '@angular/core';
import { AchievementsService } from '../../services/achievements.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { AchievementsListComponent } from '../../components/achievements/achievements-list/achievements-list.component';
import { IUserAchievement } from '../../interfaces';


@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [
    AchievementsListComponent,
    PaginationComponent,
    LoaderComponent,
    CommonModule
  ],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent {
  public achievementsService: AchievementsService = inject(AchievementsService);

  constructor() {
    this.achievementsService.search.page = 1;
    this.achievementsService.getAllByUser();  // Obtener todos los logros al cargar el componente
  }

  // Asegúrate de que el tipo de datos que pasas a 'app-achievements-list' sea IUserAchievement[]
  get achievements(): IUserAchievement[] {
    return this.achievementsService.achievements$();
  }
}
