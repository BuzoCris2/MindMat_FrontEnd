import { Component, inject, Injectable, OnInit } from '@angular/core';
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
    CommonModule
  ],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit{
  
  achievements: any[] = [];
  infiniteAchievements: any[] = [];

  constructor(private achievementsService: AchievementsService) {}

  ngOnInit(): void {
    this.achievementsService.getAchievements().subscribe({
      next: (data) => {
        this.achievements = data;

        // Duplica los elementos para crear un carrusel infinito
        this.infiniteAchievements = [
          ...this.achievements,
          ...this.achievements,
          ...this.achievements,
        ];
      },
      error: (err) => {
        console.error('Error fetching achievements:', err);
      },
    });
  }
}
