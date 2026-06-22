import { ERole } from '../../../../shared/models/enums/role';

export interface IUser {
  id: string;
  companyName: string;
  name: string;
  email: string;
  role: ERole;
  createdAt: Date;
}

export interface ICreateUserRequest {
  companyId: string;
  name: string;
  email: string;
  role: ERole;
  password: string;
}

export interface IUpdateUserRequest {
  id: string;
  name: string;
  email: string;
  role: ERole;
}

export interface IChangeUserPasswordRequest {
  id: string;
  password: string;
}
