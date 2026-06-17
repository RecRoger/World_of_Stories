import { Injectable, inject, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError, map } from 'rxjs';
import { Router } from '@angular/router';
import { User, UsersService } from '@core/api';

// 1. Definimos la interfaz del estado exactamente igual a tu viejo Reducer
interface AuthState {
  user: User | null;
  loading: boolean;
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
    loading: false,
    error: null
  });

  public user$: Observable<User | null> = this.state$.pipe(
    map(state => state.user)
  );
  public loading$: Observable<boolean> = this.state$.pipe(
    map(state => state.loading)
  );

  public currentUser = signal<User | null>(null);
  public isAuthenticated = computed(() => !!this.currentUser());
  public isLoading = signal<boolean>(false);

  constructor() {
    this.initializeAuth();
  }

  public login(username: string, password: string): Observable<boolean> {
    this.updateState({ loading: true, error: null });
    this.isLoading.set(true);

    return this.userService.login({ requestBody: { username, password } }).pipe(
      map((response) => {
        const user = response.data?.user || null;
        this.updateState({ user, loading: false });
        this.currentUser.set(user);
        this.isLoading.set(false);
        localStorage.setItem('wos_user', JSON.stringify(user));
        return true
      }),
      catchError((err) => {
        const errMsg = err.error?.message || 'Error al iniciar sesión';

        this.updateState({ user: null, loading: false, error: errMsg });
        this.currentUser.set(null);
        this.isLoading.set(false);

        return throwError(() => err);
      })
    );
  }

  public logout(): void {
    this.updateState({ user: null, loading: false, error: null });
    this.currentUser.set(null);
    localStorage.removeItem('wos_user');
  }

  public signIn(user: User): Observable<boolean> {
    const { email, username, password } = user
    return this.userService.createUser({ requestBody: { email, username, password } }).pipe(
      map((response) => {
        const user = response.data?.user || null;
        this.updateState({ loading: false });
        this.isLoading.set(false);
        localStorage.setItem('wos_user', JSON.stringify(user));
        return true
      }),
      catchError((err) => {
        const errMsg = err.error?.message || 'Error al registrar usuario';
        this.updateState({ user: null, loading: false, error: errMsg });
        this.currentUser.set(null);
        this.isLoading.set(false);
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