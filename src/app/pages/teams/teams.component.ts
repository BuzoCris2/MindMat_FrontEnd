import { Component, inject, ViewChild } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITeam } from '../../interfaces';
import { LoaderComponent } from "../../components/loader/loader.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { TeamFormComponent } from "../../components/team/team-form/team-form.component";
import { TeamListComponent } from "../../components/team/team-list/team-list.component";
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from "../../components/modal/modal.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    LoaderComponent, PaginationComponent, TeamFormComponent, TeamListComponent,
    ModalComponent, CommonModule, ReactiveFormsModule
],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {
  public teamService: TeamService = inject(TeamService);
  public authService: AuthService = inject(AuthService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addTeamsModal') public addTeamsModal: any;
  public fb: FormBuilder = inject(FormBuilder);
  teamForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    teacherLeader: ['', Validators.required],
    members: [[]] // Inicializa como un arreglo vacío si aplica
  });
  
  constructor() {
    this.teamService.search.page = 1;
    this.teamService.getAllByUser();
  }

  saveTeam(team: ITeam) {
    this.teamService.save(team);
    this.modalService.closeAll();
  }

  callEdition(team: ITeam) {
    this.teamForm.controls['id'].setValue(team.id ? String(team.id) : '');
    this.teamForm.controls['name'].setValue(team.name || '');
    this.teamForm.controls['description'].setValue(team.description || '');
    this.teamForm.controls['teacherLeader'].setValue(team.teacherLeader ? String(team.teacherLeader) : '');
    this.modalService.displayModal('md', this.addTeamsModal);
  }

  openAddTeamModal() {
    this.modalService.displayModal('md', this.addTeamsModal);
  }

  updateTeam(team: ITeam) {
    this.teamService.update(team);
    this.modalService.closeAll();
  }
}
