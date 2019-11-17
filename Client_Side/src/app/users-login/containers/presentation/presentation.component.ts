import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.updateActiveUser(null);
  }

  login(type: string) {
    if (type === 'user') {
      this.router.navigate(['/user-login']);
    }
  }

}
