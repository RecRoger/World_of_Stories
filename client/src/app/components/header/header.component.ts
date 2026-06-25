import { Component, Input, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import { filter, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MainRoutes } from '@core/models/constants';
import { UserNavComponent } from '@pages/user/components/user-nav/user-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { WriterNavComponent } from '@pages/writers/components/writer-nav/writer-nav.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatIconModule, MatButtonModule, AsyncPipe]
})
export class HeaderComponent {

  protected readonly router = inject(Router)

  public readonly mainRoutes = MainRoutes

  public readonly homeRoute = 'user/write-or-read'

  public baseRoute$: Observable<string | null> = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: NavigationEnd) => {
      const noQueryUrl = event.urlAfterRedirects.split('?')[0]
      return noQueryUrl?.slice(1)
    }),
    map((baseRoute: string) => !([MainRoutes.LOGIN, MainRoutes.WELCOME] as string[]).includes(baseRoute) ? baseRoute : null)
  )

  private _bottomSheet = inject(MatBottomSheet);

  public getOut(): void {
    this.router.navigate([`/${this.homeRoute}`]);
  }

  public openMenu(route: string): void {

    const baseRoute = route?.split('/')[0] || MainRoutes.WELCOME
    switch (baseRoute) {
      case MainRoutes.WRITERS:
        this._bottomSheet.open(WriterNavComponent);
        break;
      default:
        this._bottomSheet.open(UserNavComponent);
        break;
    }
    // this.menu.emit(true);
  }

}
