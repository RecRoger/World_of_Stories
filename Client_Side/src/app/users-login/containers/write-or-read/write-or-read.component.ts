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
import { SetInfo } from 'src/app/shared/store/general/general.actions';

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


  subscriptions: Subscription[] = [];
  ngOnInit() {
    this.subscriptions.push(
      this.user$.subscribe(us => {
        this.user = us;
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
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();

    // alert(isMobile + '-' + isTablet + '-' + isDesktopDevice);

    // true para escribir
    const roles: string[] = [...this.user.rol];
    if (activity) {
      if (!isMobile) {
        if (roles.includes(UsersRoles.W) || roles.includes(UsersRoles.A)) {
          this.startActivity(activity);
        } else {
          this.rolConfirmation = 'W';
        }
      } else {
        this.store.dispatch(
          new SetInfo('Lo sentimos, pero el modo escritor requiere mejor resolucion y no esta disponible mobile por el momento')
        );
      }
    } else {
      if (!isMobile) {
        this.store.dispatch(
          new SetInfo('La experience de lector esta pensada para dispositivos móviles.')
        );
      }
      if (roles.includes(UsersRoles.R)) {
        this.startActivity(activity);
      } else {
        this.rolConfirmation = 'R';
      }
    }
  }

  async addRol(rol) {
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
    this.cd.markForCheck();
  }

  startActivity(action: boolean) {
    if (action) {
      this.router.navigate(['/writers']);
    } else {
      this.router.navigate(['/readers']);
    }
  }
}
