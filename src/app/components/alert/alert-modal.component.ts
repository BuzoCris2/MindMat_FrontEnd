import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
  standalone: true,
})
export class AlertModalComponent {
  @Input() alertType: 'time' | 'error' | 'success' = 'success';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonText: string = 'Cerrar';
  @Output() closeAlert = new EventEmitter<void>();

  get gifSource() {
    switch (this.alertType) {
      case 'time':
        return 'assets/img/Various/animTiempo.gif';
      case 'error':
        return 'assets/img/Various/animError.gif';
      case 'success':
        return 'assets/img/Various/animExito.gif';
      default:
        return '';
    }
  }

  get titleColor() {
    switch (this.alertType) {
      case 'time':
        return 'var(--color-azul)';
      case 'error':
        return 'var(--color-rojo)';
      case 'success':
        return 'var(--color-verde)';
      default:
        return '';
    }
  }

  closeModal() {
    this.closeAlert.emit();
  }
}
