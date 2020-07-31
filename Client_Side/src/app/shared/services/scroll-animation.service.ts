import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {

  public scrollAtBottom$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public scrollElement$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }


}
