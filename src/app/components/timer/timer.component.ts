import { Component, Input, OnInit, Output, OnDestroy, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from '../../components/alert/alert-modal.component';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule,AlertModalComponent],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() initialTime: number = 180;
  @Output() timeRemaining = new EventEmitter<number>();
  @Output() timerEnded = new EventEmitter<void>();
  currentTime: number = 0;
  minutes: string = '00';
  seconds: string = '00';

  private timerInterval: any;

  showAlert = false;
  alertType: 'time' | 'error' | 'success' = 'success';
  alertTitle = '¡Éxito!';
  alertMessage = 'Campo avatarId actualizado con éxito';
  alertButtonText = 'Cerrar';

  ngOnInit(): void {
    this.currentTime = this.initialTime;
    this.updateDisplayTime();
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.currentTime > 0) {
        this.currentTime--;
        this.updateDisplayTime();
        this.timeRemaining.emit(this.currentTime);
      } else {
        clearInterval(this.timerInterval);
        this.triggerAlert('time', '¡Oh, no!', 'El tiempo del juego se ha acabado', 'Reintentar');
        this.timerEnded.emit();
      }
    }, 1000);
  }

  updateDisplayTime() {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = this.currentTime % 60;
    this.minutes = String(minutes).padStart(2, '0');
    this.seconds = String(seconds).padStart(2, '0');

    this.timeRemaining.emit(this.currentTime);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  triggerAlert(type: 'time' | 'error' | 'success', title: string, message: string, buttonText: string) {
    this.alertType = type;
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertButtonText = buttonText;
    this.showAlert = true;
  }

  closeAlertModal() {
    window.location.reload();
    this.showAlert = false;
  }
}
