import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-writer-nav',
  templateUrl: './writer-nav.component.html',
  styleUrls: ['./writer-nav.component.scss'],
  imports: [RouterLink, MatButtonModule, MatIconModule]
})
export class WriterNavComponent {

  private _bottomSheetRef = inject<MatBottomSheetRef<WriterNavComponent>>(MatBottomSheetRef);

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
