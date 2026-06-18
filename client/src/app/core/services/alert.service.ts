import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AlertTypes } from '@core/models/constants';
import { AlertMessage } from '@core/models/alert-message.dto';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private state$ = new BehaviorSubject<AlertMessage | null>(null);

  public alert$: Observable<AlertMessage | null> = this.state$;

  public setAlert(text: string, alertType: AlertTypes = AlertTypes.info): void {
    this.state$.next({
      text, alertType, time: new Date()
    })
  }

  public setError(error: any): void {
    this.state$.next({
      text: error?.body?.message || error?.message || 'Ha ocurrido un error', alertType: AlertTypes.error, time: new Date()
    })
  }

  public clearAlert(): void {
    this.state$.next(null)
  }


}