import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { User } from '@core/api';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-writers-home',
  templateUrl: './writers-home.component.html',
  styleUrls: ['./writers-home.component.scss'],
  imports: [AsyncPipe, TitleCasePipe, MatIconModule, MatButtonModule, RouterLink]
})
export class WritersHomeComponent {
  public user$: Observable<User | null> = inject(AuthService).user$
  mainInfo = false;
}
