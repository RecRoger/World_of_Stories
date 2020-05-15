import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { LogonUser } from 'src/app/shared/store/users/users.actions';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {

  constructor(private router: Router, private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new LogonUser());
  }

  login(type: string) {
    if (type === 'user') {
      this.router.navigate(['/user-login']);
    }
  }

}
