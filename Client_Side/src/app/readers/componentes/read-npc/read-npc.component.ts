import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { DeciosionOption, Place, Npc, City } from 'wos-api';
import { map } from 'rxjs/operators';
import { faChevronUp, faChevronDown, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { GetNpcStory, GetChapterData, GetNpcData } from 'src/app/shared/store/stories/stories.actions';

@Component({
  selector: 'app-read-npc',
  templateUrl: './read-npc.component.html',
  styleUrls: ['./read-npc.component.scss']
})
export class ReadNpcComponent implements OnInit, OnDestroy {

  @Select(StoriesState.getNpcs) allNpcs$: Observable<any>;
  get npcs$(): Observable<Npc[]> {
    return this.allNpcs$.pipe(map(filterFn => filterFn(this.placeId)));
  }

  @Input() cityId: string;
  @Input() placeId: string;
  @Input() npcId: string;
  npc: Npc;

  titleAnimationEnd = false;

  showDecision = false;
  enterBtn = false;

  loadingNpc = false;
  loadingChapters = false;

  showRejection = false;
  showExit = false;

  faUp = faChevronUp;
  faDown = faChevronDown;
  faRight = faChevronRight;
  faLeft = faChevronLeft;

  selectedOption: DeciosionOption;

  subscriptions: Subscription[] = [];
  atBottom = true;

  constructor(private store: Store, private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService) { }

  async ngOnInit() {
    this.loadingNpc = true;
    await this.store.dispatch(new GetNpcData({ npcId: this.npcId, placeId: this.placeId })).toPromise();
    this.loadingNpc = false;

    this.subscriptions.push(
      this.scrollService.scrollAtBottom$.subscribe(value => { this.atBottom = value; this.cd.markForCheck(); }),
      this.npcs$.subscribe(list => this.npc = list && list.find(n => n.id === this.npcId))
      // this.npcs$.subscribe(n => this.npcs = n)
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  finishMeeting(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));

    // window.scrollTo(0, document.body.scrollHeight);
    this.showDecision = true;
    // this.enterBtn = false;
    this.cd.markForCheck();
  }

  showEnter() {
    this.enterBtn = true;
    this.cd.markForCheck();
  }

  selectDecision(option: DeciosionOption) {
    this.selectedOption = option;
    this.cd.markForCheck();
  }

  async takeDecision(decision: string) {

    if (decision === 'true') {
      this.loadingChapters = true;
      const store = await this.store.dispatch(new GetNpcStory(
        { npcId: this.npc.id, placeId: this.placeId, request: { id: this.npc.id, published: false } }
      )).toPromise();
      const npc: Npc = store.stories[this.placeId].find(n => n.id === this.npc.id);
      const chapters = npc.chapters;
      this.store.dispatch(new UpdateCharacterLocation(
        {
          cityId: this.cityId,
          placeId: this.placeId,
          npcId: this.npc.id,
          chapterId: chapters[0].id
        }
      ));
      this.store.dispatch(new GetChapterData(
        {
          placeId: this.placeId,
          npcId: this.npc.id,
          chapterId: chapters[0].id
        }
      ));

    } else {
      this.showRejection = true;
      this.cd.markForCheck();
    }
  }

  getOut() {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.cityId, placeId: this.placeId, npcId: null }));
  }


}
