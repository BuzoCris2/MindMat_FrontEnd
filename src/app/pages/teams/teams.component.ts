import { Component, inject, ViewChild } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ITeam } from '../../interfaces';
import { LoaderComponent } from "../../components/loader/loader.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { TeamFormComponent } from "../../components/team/team-form/team-form.component";
import { TeamListComponent } from "../../components/team/team-list/team-list.component";

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    LoaderComponent, PaginationComponent, TeamFormComponent, TeamListComponent
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {
  public teamService: TeamService = inject(TeamService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addTeamsModal') public addTeamsModal: any;
  public fb: FormBuilder = inject(FormBuilder);
  teamForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    teacherLeader: ['', Validators.required]
  });
  
  constructor() {
    this.teamService.search.page = 1;
    this.teamService.getAll();
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

  openAddCategoryModal() {
    this.modalService.displayModal('md', this.addTeamsModal);
  }

  updateUser(team: ITeam) {
    this.teamService.update(team);
    this.modalService.closeAll();
  }
}
