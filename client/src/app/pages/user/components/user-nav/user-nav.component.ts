import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.scss'],
  imports: [RouterLink, MatButtonModule, MatIconModule]
})
export class UserNavComponent {

  private _bottomSheetRef = inject<MatBottomSheetRef<UserNavComponent>>(MatBottomSheetRef);

  private authService = inject(AuthService)

  public logout(
    event: MouseEvent
  ): void {
    this.authService.logout()
    this.openLink(event)
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
