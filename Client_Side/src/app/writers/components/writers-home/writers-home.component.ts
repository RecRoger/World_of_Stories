import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { User } from 'wos-api';
import { Subscription } from 'rxjs';
import { faGlobeAmericas, faInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-writers-home',
  templateUrl: './writers-home.component.html',
  styleUrls: ['./writers-home.component.scss']
})
export class WritersHomeComponent implements OnInit, OnDestroy {
  user: User;

  subscription: Subscription;
  @Select(UserState.getUser) $user: Observable<User>;

  faGlobeAmericas = faGlobeAmericas;

  mainInfo = false;

  faInfo = faInfo;

  constructor(
    private store: Store,
    private router: Router) { }

  ngOnInit() {
    this.subscription = this.$user.subscribe(val => {
      this.user = val;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }


}
