import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef, Inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { Decision, DeciosionOption, Place, Npc, City, Character } from 'wos-api';
import { map } from 'rxjs/operators';
import { faChevronUp, faChevronDown, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { GetNpcStory, GetChapterData, GetNpcData } from 'src/app/shared/store/stories/stories.actions';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { StorySelectorComponent } from '../story-selector/story-selector.component';

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
  @Select(UserState.getCharacter) character$: Observable<Character>;
  character: Character;

  @Input() cityId: string;
  @Input() placeId: string;
  @Input() npcId: string;
  npc: Npc;

  titleAnimationEnd = false;

  showDecision = false;

  loadingNpc = false;
  loadingChapters = false;

  showRejection = false;
  showLeave = false;
  showExit = false;

  faUp = faChevronUp;
  faDown = faChevronDown;
  faRight = faChevronRight;
  faLeft = faChevronLeft;

  selectedOption: DeciosionOption;

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet) { }

  async ngOnInit() {
    this.loadingNpc = true;
    await this.store.dispatch(new GetNpcData({ npcId: this.npcId, placeId: this.placeId })).toPromise();
    this.loadingNpc = false;

    this.subscriptions.push(
      this.npcs$.subscribe(list => this.npc = list && list.find(n => n.id === this.npcId)),
      this.character$.subscribe(char => this.character = char)
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  finishMeeting(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));
    this.showDecision = true;
    this.cd.markForCheck();
  }

  openSelection() {
    const sheet = this.bottomSheet.open(StorySelectorComponent, {
      data: {
        placeId: this.placeId,
        decision: this.npc.decision
      }
    });
    sheet.afterDismissed().subscribe((option: DeciosionOption) => {
      if (option) {
        this.takeDecision(option.value);
      }
    });
  }

  async takeDecision(decision: string) {

    this.showDecision = false;
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

  showLeaveBtn() {
    this.showLeave = true;
  }

  getOut() {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.cityId, placeId: this.placeId, npcId: null }));
  }


}
