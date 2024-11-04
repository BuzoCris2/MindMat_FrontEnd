import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() initialTime: number = 180;
  currentTime: number = 0;
  minutes: string = '00';
  seconds: string = '00';

  private timerInterval: any;

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
      } else {
        clearInterval(this.timerInterval);
        alert('Tiempo terminado');
      }
    }, 1000);
  }

  updateDisplayTime() {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = this.currentTime % 60;
    this.minutes = String(minutes).padStart(2, '0');
    this.seconds = String(seconds).padStart(2, '0');
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}
