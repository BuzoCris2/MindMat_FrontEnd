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


export interface IGame {
  id?: number;
  name?: string;
  imgURL?: string;
  status?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}


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
  teacherLeader: ITeacherLeader;
  members?: IMember[];
}

export interface IMember {
  id: number; 
  name: string; 
  lastname?: string; 
  email?: string; 
}

interface ITeacherLeader {
  id: number;
  name: string;
  lastname: string;
  email: string;  

}

export interface IUserAchievement {
  id: number;
  user: {
    id: number;
    name: string;
    lastname: string;
  };
  achievement: {
    id: number;
    name: string;
    description: string;
  };
  achievedAt: string; 
}


export interface IAchievement {
  id: any;
  name: string;
  description: string;
}