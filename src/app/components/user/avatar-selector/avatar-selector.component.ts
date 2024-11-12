import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss']
})
export class AvatarSelectorComponent {
  avatars = [
    { id: 1, src: 'assets/img/avatars/avatar1.png' },
    { id: 2, src: 'assets/img/avatars/avatar2.png' },
    { id: 3, src: 'assets/img/avatars/avatar3.png' },
    { id: 4, src: 'assets/img/avatars/avatar4.png' },
    { id: 5, src: 'assets/img/avatars/avatar5.png' },
    { id: 6, src: 'assets/img/avatars/avatar6.png' },
    { id: 7, src: 'assets/img/avatars/avatar7.png' },
  ];
  
  selectedAvatarId: number | null = null;
  @Output() avatarSelected = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  selectAvatar(avatarId: number) {
    this.selectedAvatarId = avatarId;
  }

  confirmSelection() {
    if (this.selectedAvatarId !== null) {
      this.avatarSelected.emit(this.selectedAvatarId);
    }
  }
  
  cancelSelection() {
    this.close.emit();
  }

}
