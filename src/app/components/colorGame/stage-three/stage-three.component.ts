import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stage-three',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stage-three.component.html',
  styleUrls: ['./stage-three.component.scss'],
})
export class StageThreeComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private router: Router) {}

  ctx!: CanvasRenderingContext2D;
  isDrawing = false;
  selectedColor = '#000000';
  brushSize = 5; // Tamaño inicial del trazo
  brushSizes = [2, 5, 10, 20]; // Opciones de tamaño de trazo
  colors = ['#FF0000', '#0000FF', '#FFFF00', '#FFA500', '#008000', '#800080', '#E42D24', '#FFD400', '#78B833', '#0090B3', '#603085', '#C00040', '#000000', '#FFFFFF'];

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.ctx.strokeStyle = color;
  }

  updateBrushSize() {
    this.ctx.lineWidth = this.brushSize;
  }

  enableEraser() {
    this.selectedColor = '#FFFFFF'; // Color blanco para borrar
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 20; // Grosor específico para el borrador
  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
    this.ctx.closePath();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // Dibujar el fondo blanco
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
  

  saveCanvas() {
    // Guardar el estado actual del lienzo
    const canvasData = this.canvas.nativeElement.toDataURL();
  
    // Dibujar el fondo blanco (sobre el lienzo vacío)
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  
    // Volver a cargar el contenido previamente dibujado (el lienzo original)
    const img = new Image();
    img.src = canvasData;
  
    img.onload = () => {
      // Dibujar la imagen original sobre el fondo blanco
      this.ctx.drawImage(img, 0, 0);
  
      // Descargar la imagen con el fondo blanco
      const link = document.createElement('a');
      link.download = 'canvas.png';
      link.href = this.canvas.nativeElement.toDataURL();
      link.click();
    };
  }
  
  

  goToNextPage() {
    this.router.navigate(['/app/dashboard']);
  }
}
