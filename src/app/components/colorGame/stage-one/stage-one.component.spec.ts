import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StageOneComponent } from './stage-one.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { GamesKnoledgeBaseComponent } from '../../game/games-knoledge-base/games-knoledge-base.component';

describe('StageOneComponent', () => {
  let component: StageOneComponent;
  let fixture: ComponentFixture<StageOneComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [StageOneComponent, GamesKnoledgeBaseComponent], // Importa el componente
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StageOneComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update currentTextIndex when updateTextIndex is called', () => {
    component.updateTextIndex(5);
    expect(component.currentTextIndex).toBe(5);
  });

  
});