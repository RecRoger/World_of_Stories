import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { DeciosionOption, Place, Npc, Chapter, CharacterLocation, Decision, Character } from 'wos-api';
import { map } from 'rxjs/operators';
import { faChevronUp, faChevronDown, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { last } from 'lodash';
import { GetChapterData } from 'src/app/shared/store/stories/stories.actions';
import { MatBottomSheet } from '@angular/material';
import { StorySelectorComponent } from '../story-selector/story-selector.component';

@Component({
  selector: 'app-read-chapters',
  templateUrl: './read-chapters.component.html',
  styleUrls: ['./read-chapters.component.scss']
})
export class ReadChaptersComponent implements OnInit, OnDestroy {

  @Select(UserState.getCharacterLocation) location$: Observable<CharacterLocation>;
  @Select(StoriesState.getNpcs) allNpcs$: Observable<any>;
  get npcs$(): Observable<Npc[]> {
    return this.allNpcs$.pipe(map(filterFn => filterFn(this.placeId)));
  }
  @Select(StoriesState.getStory) allChapters$: Observable<any>;
  get chapters$(): Observable<Chapter[]> {
    return this.allChapters$.pipe(map(filterFn => filterFn(this.placeId, this.npcId)));
  }
  @Select(UserState.getCharacter) character$: Observable<Character>;
  character: Character;

  @Input() cityId: string;
  @Input() placeId: string;
  @Input() npcId: string;

  npc: Npc;

  titleAnimationEnd = false;

  showDecision = false;

  loadingChapter = false;

  faUp = faChevronUp;
  faDown = faChevronDown;
  faRight = faChevronRight;
  faLeft = faChevronLeft;

  storyChapters: {
    chapter: Chapter,
    option: DeciosionOption
  }[] = [];

  currentDecision: Decision;
  outBtn = false;

  subscriptions: Subscription[] = [];
  atBottom = true;

  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.subscriptions.push(
      this.chapters$.subscribe(list => {
        const location = this.store.selectSnapshot(UserState.getCharacterLocation);
        const lastChapter = this.storyChapters.slice(-1)[0];

        if (list && location.chapterId && (!lastChapter || location.chapterId !== lastChapter.chapter.id)) {
          const chapter = list.find(c => c.id === location.chapterId);
          if (chapter && chapter.story) {
            this.continueChapter(chapter);
          } else {
            this.store.dispatch(new GetChapterData({ chapterId: location.chapterId, npcId: location.npcId, placeId: location.placeId }));
          }
        }
      }),
      this.location$.subscribe(location => {
        this.store.dispatch(new GetChapterData({ chapterId: location.chapterId, npcId: location.npcId, placeId: location.placeId }));
      }),
      this.npcs$.subscribe(list => {
        this.npc = list && list.find(n => n.id === this.npcId);
      }),
      this.character$.subscribe(char => {
        this.character = char;
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  continueChapter(chapter: Chapter) {
    this.currentDecision = (!chapter.endLocation || !chapter.endLocation.endChapter) ? chapter.usersDecisions : null;
    this.storyChapters.push({ chapter, option: null });
  }

  finishStory(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));
    if (this.currentDecision) {
      this.showDecision = true;
    } else {
      this.outBtn = true;
    }
    this.cd.markForCheck();
  }

  openSelection() {
    const sheet = this.bottomSheet.open(StorySelectorComponent, {
      data: {
        decision: this.currentDecision
      }
    });
    sheet.afterDismissed().subscribe((option: DeciosionOption) => {
      if (option) {
        this.showDecision = false;
        const lastChapter = this.storyChapters.slice(-1)[0];
        lastChapter.option = option;
      }
    });
  }

  finishAllStory() {
    const lastChapter = this.storyChapters.slice(-1)[0].chapter;
    const endLocation = lastChapter.endLocation;
    this.store.dispatch(new UpdateCharacterLocation({
      chapterId: null,
      cityId: endLocation.cityId,
      placeId: endLocation.placeId,
      npcId: null
    }));
  }

  async takeDecision(option: DeciosionOption) {

    const chapterId = option.value;

    this.store.dispatch(new UpdateCharacterLocation({
      chapterId,
      cityId: this.cityId,
      placeId: this.placeId,
      npcId: this.npcId
    }));
  }

  getOut() {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.cityId, placeId: this.placeId, npcId: this.npcId, chapterId: null }));
  }



}
