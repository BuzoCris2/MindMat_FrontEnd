import { Time } from "@angular/common";

export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  avatarId? : number
  authorities?: IAuthority[];
  role?: IRole
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRoleType {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN'
}

export interface IRole {
  createdAt: string;
  description: string;
  id: number;
  name : string;
  updatedAt: string;
}

//Este es el Game que habría que borrar
export interface IGame {
  id?: number;
  name?: string;
  imgURL?: string;
  status?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

//Este es el Game que estamos usando
export interface Game {
  id: number;
  name: string;
  categories: string[];
  route: string;
}

export interface IGame2 {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrder {
  id?: number;
  description?: string;
  total?: number;
}

export interface ISearch {
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?:number;
}

export interface IGridCell {
  row: number;
  column: string; 
  hasShip: number;
  isHit: number;
}

export interface IShip {
  id: number;
  name: string;
  size: number;
  hitCount: number;
  cellsOccupied: IGridCell[];
}

export interface IScore {
  id?: number;
  obtainedAt?: string;
  rightAnswers?: number;
  stars?: number;
  timeTaken?: string;
  wrongAnswers?: number;
  game?: IGame2;
  user?: IUser;
}
export interface ITeam {
  avatarId?: number;
  id?: number;
  name?: string;
  description?: string;
  teacherLeader: ITeacherLeader; // Solo el ID aquí
  members?: IMember[];
}

export interface IMember {
  id: number; // ID del miembro
  name: string; // Nombre del miembro
  lastname?: string; // Apellido del miembro
  email?: string; // Correo electrónico del miembro
}

interface ITeacherLeader {
  id: number;
  name: string;
  lastname: string;
  email: string;  // Si necesitas también el email
  //teamCount: number;

}

export interface IUserAchievement {
  id: number;
  user: {
    id: number;
    name: string;
    lastname: string;
    // Otros campos del usuario si es necesario
  };
  achievement: {
    id: number;
    name: string;
    description: string;
    // Otros campos del logro si es necesario
  };
  achievedAt: string;  // Fecha en que el logro fue alcanzado
}


export interface IAchievement {
  id: any;
  name: string;
  description: string;
}