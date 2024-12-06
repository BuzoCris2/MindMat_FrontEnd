import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeam } from '../../../interfaces';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss'
})
export class TeamListComponent {
  @Input() title: string = '';
  @Input() teams: ITeam[] = [];
  @Output() callModalAction: EventEmitter<ITeam> = new EventEmitter<ITeam>();
  @Output() callDeleteAction: EventEmitter<ITeam> = new EventEmitter<ITeam>();
  @Output() openAddMemberModal: EventEmitter<number> = new EventEmitter<number>(); // Aquí se espera un number
  @Output() removeMemberMethod: EventEmitter<number> = new EventEmitter<number>(); // Aquí también un number

  public trackById(index: number, item: ITeam): number {
    return item.id || 0;
  }
  
}
