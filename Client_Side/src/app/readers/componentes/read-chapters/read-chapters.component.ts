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
    aceptBtn?: boolean
  }[] = [];

  currentDecision: Decision;
  outBtn = false;

  subscriptions: Subscription[] = [];
  atBottom = true;

  constructor(private store: Store, private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.scrollService.scrollAtBottom$.subscribe(value => { this.atBottom = value; this.cd.markForCheck(); }),
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
    this.storyChapters.push({ chapter, option: null, aceptBtn: false });
  }

  finishStory(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));
    // window.scrollTo(0, document.body.scrollHeight);
    if (this.currentDecision) {
      this.showDecision = true;
    } else {
      this.outBtn = true;
    }
    // this.enterBtn = false;
    this.cd.markForCheck();
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

  selectDecision(option: DeciosionOption) {
    const lastChapter = this.storyChapters.slice(-1)[0];
    lastChapter.option = option;
    lastChapter.aceptBtn = false;
    this.cd.markForCheck();
  }
  showAccept() {
    const lastChapter = this.storyChapters.slice(-1)[0];
    lastChapter.aceptBtn = true;
    this.cd.markForCheck();
  }

  async takeDecision(chapterId: string) {

    this.showDecision = false;
    const lastChapter = this.storyChapters.slice(-1)[0];
    lastChapter.aceptBtn = false;
    this.store.dispatch(new UpdateCharacterLocation({
      chapterId,
      cityId: this.cityId,
      placeId: this.placeId,
      npcId: this.npcId
    }));

    // console.log('llegue a tomar decision', decision);

    // if (decision === 'true') {
    //   this.loadingChapters = true;
    //   const store = await this.store.dispatch(new GetNpcStory(
    //     { npcId: this.npc.id, placeId: this.place.id, request: { id: this.npc.id, published: false } }
    //   )).toPromise();
    //   const npc: Npc = store.stories[this.place.id].find(n => n.id === this.npc.id);
    //   const chapters = npc.chapters;
    //   this.store.dispatch(new UpdateCharacterLocation(
    //     {
    //       cityId: this.cityId,
    //       placeId: this.place.id,
    //       npcId: this.npc.id,
    //       chapterId: chapters[0].id
    //     }
    //   ));
    // } else {
    //   this.showRejection = true;
    //   this.cd.markForCheck();
    // }
  }

  getOut() {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.cityId, placeId: this.placeId, npcId: this.npcId, chapterId: null }));
  }



}
