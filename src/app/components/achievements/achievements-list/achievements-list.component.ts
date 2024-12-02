import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IUserAchievement, IUser } from '../../../interfaces';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-achievements-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements-list.component.html',
  styleUrl: './achievements-list.component.scss'
})
export class AchievementsListComponent {
  @Input() title: string = '';
  @Input() achievements: IUserAchievement[] = [];

  public trackById(index: number, item: IUserAchievement): number {
    return item.id || 0;
  }
}
