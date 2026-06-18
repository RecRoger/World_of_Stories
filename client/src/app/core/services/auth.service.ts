import { Injectable, inject, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError, map, delay } from 'rxjs';
import { Router } from '@angular/router';
import { User, UsersService } from '@core/api';

// 1. Definimos la interfaz del estado exactamente igual a tu viejo Reducer
interface AuthState {
  user: User | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userService = inject(UsersService);

  private router = inject(Router);

  private state$ = new BehaviorSubject<AuthState>({
    user: null,
    error: null
  });

  public user$: Observable<User | null> = this.state$.pipe(
    map(state => state.user)
  );

  public currentUser = signal<User | null>(null);
  public isAuthenticated = computed(() => !!this.currentUser());
  public isLoading = signal<boolean>(false);

  constructor() {
    this.initializeAuth();
  }

  public login(username: string, password: string): Observable<boolean> {
    this.updateState({ error: null });
    return this.userService.login({ requestBody: { username, password } }).pipe(
      map((response) => {
        const user = response.data?.user || null;
        this.updateState({ user });
        this.currentUser.set(user);
        localStorage.setItem('wos_user', JSON.stringify(user));
        return true
      }),
      catchError((err) => {
        const errMsg = err.error?.message || 'Error al iniciar sesión';

        this.updateState({ user: null, error: errMsg });
        this.currentUser.set(null);
        throw (err);
      })
    );
  }

  public logout(): void {
    this.updateState({ user: null, error: null });
    this.currentUser.set(null);
    localStorage.removeItem('wos_user');
  }

  public signIn(user: User): Observable<boolean> {
    const { email, username, password } = user
    return this.userService.createUser({ requestBody: { email, username, password } }).pipe(
      map((response) => {
        const user = response.data?.user || null;
        localStorage.setItem('wos_user', JSON.stringify(user));
        return true
      }),
      catchError((err) => {
        const errMsg = err.error?.message || 'Error al registrar usuario';
        this.updateState({ user: null, error: errMsg });
        this.currentUser.set(null);
        return throwError(() => err);
      })
    );
  }

  private updateState(newState: Partial<AuthState>): void {
    this.state$.next({
      ...this.state$.value,
      ...newState
    });
  }

  private initializeAuth(): void {
    const savedUser = localStorage.getItem('wos_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.updateState({ user });
        this.currentUser.set(user);
      } catch {
        this.logout();
      }
    }
  }
}