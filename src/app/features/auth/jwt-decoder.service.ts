import { Injectable } from '@angular/core';
import { IUser } from './login/models/auth';

interface IJwtPayload {
  id: string;
  email: string;
  role: string;
  co: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {
  decode(token: string): IJwtPayload | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      const decoded = atob(
        payload.replace(/-/g, '+').replace(/_/g, '/')
      );

      return JSON.parse(decoded) as IJwtPayload;
    } catch {
      return null;
    }
  }

  getUser(token: string): IUser | null {
    const payload = this.decode(token);
    if (!payload) return null;

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      companyAlias: payload.co
    };
  }

  isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
}
