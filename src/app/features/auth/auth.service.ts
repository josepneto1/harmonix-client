import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  of,
  map,
  tap,
  catchError,
  filter,
  take,
} from 'rxjs';
import { ILoginResponse, IUser } from './login/models/auth';
import { JwtDecoderService } from './jwt-decoder.service';
import { Router } from '@angular/router';
import { ERole } from '../../shared/models/enums/role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private jwtDecoder = inject(JwtDecoderService);
  private router = inject(Router);

  private readonly apiUrl = 'https://localhost:7226/api';

  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();

  private accessToken: string | null = null;

  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<boolean | null>(null);

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<ILoginResponse>(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap(res => this.setSession(res)),
        map(() => void 0)
      );
  }

  // REFRESH SILENCIOSO
  refreshToken(): Observable<boolean> {
    return this.http
      .post<ILoginResponse>(`${this.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(res => this.setSession(res)),
        map(() => true),
        catchError(() => {
          this.clearSession();
          return of(false);
        })
      );
  }

  // REFRESH CONTROLADO
  refreshTokenOnce(): Observable<boolean> {
    if (this.refreshInProgress) {
      return this.refreshSubject.pipe(
        filter(v => v !== null),
        take(1)
      ) as Observable<boolean>;
    }

    this.refreshInProgress = true;
    this.refreshSubject.next(null);

    return this.refreshToken().pipe(
      tap(success => {
        this.refreshInProgress = false;
        this.refreshSubject.next(success);
      }),
      catchError(() => {
        this.refreshInProgress = false;
        this.refreshSubject.next(false);
        return of(false);
      })
    );
  }

  // INICIALIZA AUTH (GUARDS)
  checkAuth(): Observable<boolean> {
    if (this.accessToken && !this.jwtDecoder.isExpired(this.accessToken)) {
      return of(true);
    }

    if (this.refreshInProgress) {
      return this.refreshSubject.pipe(
        filter(v => v !== null),
        take(1)
      ) as Observable<boolean>;
    }

    return this.refreshTokenOnce();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isSysAdmin(): boolean {
    return this.userSubject.value?.role === ERole.SysAdmin;
  }

  getCompanyAlias(): string | null {
    var res = this.userSubject.value?.companyAlias ?? null;
    return res;
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.clearSession();
        this.router.navigate(['/login']);
      });
  }

  private setSession(res: ILoginResponse): void {
    this.accessToken = res.accessToken;

    const user = this.jwtDecoder.getUser(this.accessToken);
    this.userSubject.next(user);
  }

  private clearSession(): void {
    this.accessToken = null;
    this.userSubject.next(null);
  }
}
