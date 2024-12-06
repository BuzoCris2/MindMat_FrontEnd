import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ITeam } from '../../../interfaces';
import { ModalService } from '../../../services/modal.service';
import { ModalComponent } from "../../../components/modal/modal.component";

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
  @Input() set teams(value: ITeam[]) {
    if (value && value.length > 0) {
      this._teams = [...value];
      console.log('Paso 6: Datos actualizados en TeamListComponent via setter:', this._teams);
    } else {
      console.warn('Paso 7: Valor recibido en setter de teams está vacío:', value);
    }
  }
  protected _teams: ITeam[] = []; // Cambiar de `private` a `protected` o `public`
  get teams(): ITeam[] {
    return this._teams;
  }  
  @Output() callModalAction: EventEmitter<ITeam> = new EventEmitter<ITeam>();
  @Output() callDeleteAction: EventEmitter<ITeam> = new EventEmitter<ITeam>();
  @Output() openAddMemberModal: EventEmitter<number> = new EventEmitter<number>();
  @Output() confirmDelete: EventEmitter<ITeam> = new EventEmitter<ITeam>();
  @Output() removeMemberMethod: EventEmitter<number> = new EventEmitter<number>();
  @Output() onConfirmDelete: EventEmitter<ITeam> = new EventEmitter<ITeam>();

  
  public selectedTeam: ITeam | null = null;
  public isModalVisible: boolean = false;

  public trackById(index: number, item: ITeam): number {
    return item.id || 0;
  }

  constructor(private modalService: ModalService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['teams']) {
      console.log('Paso 3: Cambios detectados en `teams` (ngOnChanges):', changes['teams']);
      if (changes['teams'].currentValue && changes['teams'].currentValue.length > 0) {
        this.teams = [...changes['teams'].currentValue]; // Asegurar inmutabilidad
        console.log('Paso 4: Valor actualizado de teams en TeamListComponent:', this.teams);
      } else {
        console.warn('Paso 5: `teams` llegó vacío o nulo a TeamListComponent');
      }
    }
  }     

  confirmDeleteTeam(team: ITeam): void {
    this.selectedTeam = team; // Guarda el equipo seleccionado
    this.isModalVisible = true; // Muestra el modal
  }  

  closeModal(): void {
    this.isModalVisible = false; // Ocultamos el modal
    this.selectedTeam = null; // Reseteamos la selección
  }

  confirmTeamDeletion(): void {
    if (this.selectedTeam) {
      console.log('Deleting team:', this.selectedTeam);
      this.confirmDelete.emit(this.selectedTeam); // Emite el evento al componente padre
      this.closeModal();
    } else {
      console.error('No team selected for deletion.');
    }
  }
  
  
}
