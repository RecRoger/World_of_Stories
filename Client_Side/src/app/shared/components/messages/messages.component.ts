import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GeneralState, MessageModel } from '../../store/general/general.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(private store: Store, private cd: ChangeDetectorRef) { }

  @Select(GeneralState.errorAlerts) errors$: Observable<MessageModel>;
  error: MessageModel;

  ngOnInit() {
    this.errors$.subscribe(error => {
      this.error = error;
      this.cd.markForCheck();

      setTimeout(() => {
        this.error = null;
        this.cd.markForCheck();
      }, 5000);

    });
  }

}
