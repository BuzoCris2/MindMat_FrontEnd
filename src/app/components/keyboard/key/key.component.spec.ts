import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { KeyComponent } from './key.component';

describe('KeyComponent', () => {
  let component: KeyComponent;
  let fixture: ComponentFixture<KeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyComponent], // Importar el componente standalone
    }).compileComponents();
    
    fixture = TestBed.createComponent(KeyComponent);
    component = fixture.componentInstance;
  });

  // 1. Verificar que el componente se crea correctamente
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // 2. Verificar que las propiedades @Input se establecen correctamente
  it('should set input properties correctly', () => {
    component.name = 'A';
    component.value = 'a';
    component.soundSource = '../assets/audio/keyboard/a.mp3';
    component.status = 'active';
    component.backgroundColor = 'blue';
    component.color = 'white';
    component.tone = 'normal';
    component.customClass = 'key-class';

    expect(component.name).toBe('A');
    expect(component.value).toBe('a');
    expect(component.soundSource).toBe('../assets/audio/keyboard/a.mp3');
    expect(component.status).toBe('active');
    expect(component.backgroundColor).toBe('blue');
    expect(component.color).toBe('white');
    expect(component.tone).toBe('normal');
    expect(component.customClass).toBe('key-class');
  });

  // 3. Verificar que playNote se llama con el valor correcto (sin intentar reproducir el audio)
  it('should play the correct sound when playNote is called', fakeAsync(() => {
    // Crear un objeto simulado de Audio
    const audioMock = {
      play: jasmine.createSpy('play'),
      pause: jasmine.createSpy('pause'),
      currentTime: 0,
      duration: 0
    };
  
    // Espiar la creación del objeto Audio para que devuelva la simulación
    spyOn(window, 'Audio').and.returnValue(audioMock as any); // Cast a `any` para evitar problemas de tipos
  
    // Llamar a la función playNote
    component.playNote('a');
  
    tick(1000); // Simular el paso de 1 segundo
  
    // Verificar que se haya llamado a play con la URL correcta
    expect(audioMock.play).toHaveBeenCalled();
    expect(audioMock.play).toHaveBeenCalledWith();
  }));
  
});
