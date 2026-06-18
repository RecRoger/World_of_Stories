import { Component, Input, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import { filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MainRoutes } from '@core/models/constants';
import { UserNavComponent } from '@pages/user/components/user-nav/user-nav.component';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatIconModule, MatButtonModule, AsyncPipe]
})
export class HeaderComponent {

  protected readonly router = inject(Router)

  public readonly mainRoutes = MainRoutes

  public baseRoute$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.urlAfterRedirects?.split('/')[1] || MainRoutes.WELCOME),
    map((baseRoute: string) => !([MainRoutes.LOGIN, MainRoutes.WELCOME] as string[]).includes(baseRoute) ? baseRoute : null)
  )

  private _bottomSheet = inject(MatBottomSheet);

  public getOut(): void {
    this.router.navigate(['/user/write-or-read']);
  }

  public openMenu(route: string): void {
    let navComponent
    switch (route) {
      // case MainRoutes.USER:
      default:
        navComponent = UserNavComponent
        break;
    }
    this._bottomSheet.open(navComponent);
    // this.menu.emit(true);
  }

}
