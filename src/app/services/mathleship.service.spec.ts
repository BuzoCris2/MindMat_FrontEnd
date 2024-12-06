import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MathleshipService } from './mathleship.service';
import { IShip } from '../interfaces';

describe('MathleshipService', () => {
  let service: MathleshipService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MathleshipService],
    });

    service = TestBed.inject(MathleshipService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no haya solicitudes abiertas
    httpMock.verify();
  });

  it('should initialize the board with ships', () => {
    const mockShips: IShip[] = [
        {
          id: 1,
          name: 'Battleship',
          size: 4,
          hitCount: 0,
          cellsOccupied: [
            { row: 1, column: 'A', hasShip: 1, isHit: 0 },
            { row: 1, column: 'B', hasShip: 1, isHit: 0 },
            { row: 1, column: 'C', hasShip: 1, isHit: 0 },
            { row: 1, column: 'D', hasShip: 1, isHit: 0 }
          ]
        },
        {
          id: 2,
          name: 'Cruiser',
          size: 3,
          hitCount: 0,
          cellsOccupied: [
            { row: 3, column: 'E', hasShip: 1, isHit: 0 },
            { row: 3, column: 'F', hasShip: 1, isHit: 0 },
            { row: 3, column: 'G', hasShip: 1, isHit: 0 }
          ]
        }
      ];
      

    service.initializeBoard().subscribe((ships) => {
      expect(ships).toEqual(mockShips);
    });

    const req = httpMock.expectOne('api/mathleship/initialize');
    expect(req.request.method).toBe('GET');
    req.flush(mockShips); // Simula la respuesta del backend
  });

  it('should attack a cell and return response', () => {
    const attackResponse = { success: true, message: 'Hit!' };
    const row = 1;
    const column = 'A';

    service.attackCell(row, column).subscribe((response) => {
      expect(response).toEqual(attackResponse);
    });

    const req = httpMock.expectOne('api/mathleship/attack');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ row, column });
    req.flush(attackResponse); // Simula la respuesta del backend
  });

  it('should get the list of ships', () => {
    const mockShips: IShip[] = [
        {
          id: 1,
          name: 'Battleship',
          size: 4,
          hitCount: 0,
          cellsOccupied: [
            { row: 1, column: 'A', hasShip: 1, isHit: 0 },
            { row: 1, column: 'B', hasShip: 1, isHit: 0 },
            { row: 1, column: 'C', hasShip: 1, isHit: 0 },
            { row: 1, column: 'D', hasShip: 1, isHit: 0 }
          ]
        },
        {
          id: 2,
          name: 'Cruiser',
          size: 3,
          hitCount: 0,
          cellsOccupied: [
            { row: 3, column: 'E', hasShip: 1, isHit: 0 },
            { row: 3, column: 'F', hasShip: 1, isHit: 0 },
            { row: 3, column: 'G', hasShip: 1, isHit: 0 }
          ]
        }
      ];
      

    service.getShips().subscribe((ships) => {
      expect(ships).toEqual(mockShips);
    });

    const req = httpMock.expectOne('api/mathleship/initialize');
    expect(req.request.method).toBe('GET');
    req.flush(mockShips); // Simula la respuesta del backend
  });
});