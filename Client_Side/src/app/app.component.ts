import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { GeneralState } from './shared/store/general/general.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {}
  title = 'world-of-stories';

  @Select(GeneralState.isLoading) loader$: Observable<number>;
}
