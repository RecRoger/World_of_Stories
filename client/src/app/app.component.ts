import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MessagesComponent } from '@components/messages/messages.component';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LoaderComponent, MessagesComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public loading$ = of(false)
}
