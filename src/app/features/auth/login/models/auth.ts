export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  expiresAt: string;
}

export interface IUser {
  id: string;
  email: string;
  role: string;
  companyAlias: string;
}
