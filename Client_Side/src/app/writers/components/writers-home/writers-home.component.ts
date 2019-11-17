import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { UserModel } from 'src/app/shared/models/client_models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-writers-home',
  templateUrl: './writers-home.component.html',
  styleUrls: ['./writers-home.component.scss']
})
export class WritersHomeComponent implements OnInit {
  user: UserModel;

  constructor(
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.user = this.userService.activeUserSnapchat;
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }


}
