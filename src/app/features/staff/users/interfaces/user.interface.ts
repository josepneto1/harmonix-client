import { ERole } from '../../../../shared/models/enums/role';

export interface IUser {
  id: string;
  companyName: string;
  name: string;
  email: string;
  role: ERole;
  createdAt: Date;
}
