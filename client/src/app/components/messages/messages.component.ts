import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AlertMessage } from '@core/models/alert-message.dto';
import { AlertTypes } from '@core/models/constants';
import { AlertService } from '@core/services/alert.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [NgClass, AsyncPipe]
})
export class MessagesComponent {
  protected readonly alertService = inject(AlertService)

  public readonly alertTypes = AlertTypes

  public alerts$: Observable<AlertMessage | null> = this.alertService.alert$
    .pipe(
      tap((_) => {
        setTimeout(() => {
          this.hardClose()
        }, this.closeTime);
      })
    )

  private closeTime = 100000

  hardClose() {
    this.alertService.clearAlert()
  }

}
