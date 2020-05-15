import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/shared/models/client_models/user.model';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';

@Component({
  selector: 'app-writers-home',
  templateUrl: './writers-home.component.html',
  styleUrls: ['./writers-home.component.scss']
})
export class WritersHomeComponent implements OnInit {
  user: UserModel;

  constructor(
    private store: Store,
    private router: Router) { }

  ngOnInit() {
    this.user = this.store.selectSnapshot(UserState.getUser);
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }


}
