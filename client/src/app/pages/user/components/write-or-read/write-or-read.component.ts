import { AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { LoaderComponent } from '@components/loader/loader.component';
import { User, UsersService } from '@core/api';
import { AlertTypes, UsersRoles } from '@core/models/constants';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { catchError, Subscription, tap } from 'rxjs';

const WritersCode = 'am I a Writer?' as string;

@Component({
  selector: 'app-write-or-read',
  templateUrl: './write-or-read.component.html',
  styleUrls: ['./write-or-read.component.scss'],
  imports: [AsyncPipe, LoaderComponent, ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule,]

})
export class WriteOrReadComponent {
  private readonly router = inject(Router)
  protected readonly authService = inject(AuthService)

  public user$ = this.authService.user$.pipe(tap(us => {
    this.user = us;
    this.needUpdate = (!us?.email || !us.username);
  }));

  public needUpdate = false;

  public loading = false;

  public writerControl = new FormControl([]);

  public rolConfirmation = '';
  private user: User | null = null;

  private readonly alertService = inject(AlertService)

  private readonly usersService = inject(UsersService)

  getOut() {
    this.router.navigate(['/']);
  }

  userChooseActivity(activity: boolean): void {

    if (!this.needUpdate) {
      const anchoPantalla = window.innerWidth;
      const isMobile = (anchoPantalla < 768);
      // true para escribir
      const roles: string[] = [...this.user?.role || []];
      if (activity) {
        if (roles.includes(UsersRoles.W) || roles.includes(UsersRoles.A)) {
          this.startActivity(activity);
          if (isMobile) {
            this.alertService.setAlert('El modo escritor puede resultar mucho mas comodo desde una pantalla mas grande.', AlertTypes.info);
          }
        } else {
          this.rolConfirmation = 'W';
        }
      } else {
        if (roles.includes(UsersRoles.R)) {
          this.startActivity(activity);
          if (!isMobile) {
            this.alertService.setAlert('La experience de lector esta pensada para dispositivos móviles. Aun no contamos con su mejor diseño en pantallas grandes ', AlertTypes.info);
          }
        } else {
          this.rolConfirmation = 'R';
        }
      }
    }
  }

  async addRole(rol: string): Promise<void> {
    const writerPass = this.writerControl.value || ''
    if (rol === 'R' || (writerPass === WritersCode)) {
      this.rolConfirmation = '';
      this.loading = true;
      const data = {
        id: this.user?.id || '',
        requestBody: {
          role: (rol === 'W') ? UsersRoles.W : UsersRoles.R
        }
      };
      this.usersService.setRole(data).pipe(catchError(err => {
        this.alertService.setError(err)
        this.loading = false;
        throw err
      })).subscribe((response) => {
        this.startActivity((rol === 'W') ? true : false);
        this.writerControl.reset();
        this.loading = false;
      })
    } else {
      this.writerControl.reset();
      this.alertService.setError({ message: 'Codigo invalido' });
    }
  }

  startActivity(action: boolean) {
    if (action) {
      this.router.navigate(['/writers']);
    } else {
      this.router.navigate(['/readers']);
    }
  }

  goToUpdateUser() {
    this.router.navigate(['user/settings']);
  }
}
