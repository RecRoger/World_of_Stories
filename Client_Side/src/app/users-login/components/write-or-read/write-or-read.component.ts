import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UsersRoles } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { Store, Select } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { AddUserRoll } from 'src/app/shared/store/users/users.actions';
import { User, RequestSetRol } from 'wos-api';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SetInfo, SetError } from 'src/app/shared/store/general/general.actions';

const WritersCode = 'am I a Writer?';

@Component({
  selector: 'app-write-or-read',
  templateUrl: './write-or-read.component.html',
  styleUrls: ['./write-or-read.component.scss']
})
export class WriteOrReadComponent implements OnInit, OnDestroy {

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) { }

  @Select(UserState.getUser) user$: Observable<User>;
  user: User;
  rolConfirmation = '';

  loading = false;
  errorMsg = '';

  writerPass = '';

  needUpdate = false;

  subscriptions: Subscription[] = [];
  ngOnInit() {
    this.subscriptions.push(
      this.user$.subscribe(us => {
        this.user = us;
        this.needUpdate = (!this.user.email || !this.user.username);
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getOut() {
    this.router.navigate(['/']);
  }

  userChooseActivity(activity: boolean) {

    if (!this.needUpdate) {
      const isMobile = this.deviceService.isMobile();
      // const isTablet = this.deviceService.isTablet();
      // const isDesktopDevice = this.deviceService.isDesktop();

      // alert(isMobile + '-' + isTablet + '-' + isDesktopDevice);

      // true para escribir
      const roles: string[] = [...this.user.rol];
      if (activity) {
        if (roles.includes(UsersRoles.W) || roles.includes(UsersRoles.A)) {
          this.startActivity(activity);
          if (isMobile) {
            this.store.dispatch(
              new SetInfo('El modo escritor puede resultar mucho mas comodo desde una pantalla mas grande.')
            );
          }
        } else {
          this.rolConfirmation = 'W';
        }
      } else {
        if (roles.includes(UsersRoles.R)) {
          this.startActivity(activity);
          if (!isMobile) {
            this.store.dispatch(
              new SetInfo('La experience de lector esta pensada para dispositivos móviles. Aun no contamos con su mejor diseño en pantallas grandes ')
            );
          }
        } else {
          this.rolConfirmation = 'R';
        }
      }
    }
  }

  async addRol(rol) {
    if (rol === 'R' || (this.writerPass === WritersCode)) {
      this.rolConfirmation = '';
      this.loading = true;
      this.cd.markForCheck();
      const data: RequestSetRol = {
        id: this.user.id,
        rol: (rol === 'W') ? UsersRoles.W : UsersRoles.R
      };
      await this.store.dispatch(new AddUserRoll(data)).toPromise();
      this.startActivity((rol === 'W') ? true : false);
      this.loading = false;
    } else {
      this.writerPass = '';
      this.store.dispatch(new SetError('Codigo invalido'));
    }
    this.cd.markForCheck();
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
