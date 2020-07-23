import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { User, Chapter, Place, Npc, ChapterUpdate, RequestUpdateChapter } from 'src/client-api';
import { Select, Store } from '@ngxs/store';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { map } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { isValid } from 'src/app/shared/utils/commons';
import { UpdateChapter } from 'src/app/shared/store/stories/stories.actions';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';

@Component({
  selector: 'app-chapters-builder',
  templateUrl: './chapters-builder.component.html',
  styleUrls: ['./chapters-builder.component.scss']
})
export class ChaptersBuilderComponent implements OnInit {

  user: User;

  @Select(StoriesState.getStory) allChapters$: Observable<any>;
  get chapters$(): Observable<Chapter[]> {
    return this.allChapters$.pipe(map(filterFn => filterFn(this.place.id, this.npc.id)));
  }

  @Input() place: Place;
  @Input() npc: Npc;

  chaptersTab: {
    chapters?: string[];
    loading?: boolean
    editing?: boolean;
    endChapter?: false;
  } = { chapters: [] };

  chapterForm: FormGroupTyped<ChapterUpdate>;
  cities = [];

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.user = this.store.selectSnapshot(UserState.getUser);
    this.cities = this.store.selectSnapshot(LocationState.getCities).map(l => ({name: l.name, value: l.id}));
  }

  ngOnInit() {
  }

  toggleChapterInfo(id: string) {
    if (!this.chaptersTab || !this.chaptersTab.editing) {
      if (this.chaptersTab && this.chaptersTab.chapters.includes(id)) {
        this.chaptersTab.chapters = this.chaptersTab.chapters.filter(i => i !== id);
      } else {
        this.chaptersTab.chapters = [id];
        this.chaptersTab.editing = false;
        this.chaptersTab.endChapter = false;
      }
      this.cd.markForCheck();
    }
  }

  editChapter(chapter: Chapter) {
    if (!this.chaptersTab.editing) {
      this.chaptersTab.chapters = [chapter.id];

      this.chapterForm = this.fb.group({
        id: [chapter.id, [Validators.required]],
        name: [chapter.name, [Validators.required]],
        story: [chapter.story || [], [Validators.required]],
        item: [chapter.items || [], []],
        endLocation: this.fb.group({
          endChapter: null,
          locationType: [chapter.endLocation && chapter.endLocation.locationType || 'city', []],
          locationId: [chapter.endLocation && chapter.endLocation.locationId || null, []]
        }),
        usersDecisions: [chapter.usersDecisions || {}, [Validators.required]],
        author: [this.user.username, [Validators.required]]
      });
    }
    this.chaptersTab.editing = !this.chaptersTab.editing;
    this.cd.markForCheck();

  }

  saveChapterEdition(cancel?) {
    if (cancel) {
      this.chaptersTab.editing = false;
      this.cd.markForCheck();
      return true;
    }

    if (isValid(this.chapterForm)) {

      const updateRequest: RequestUpdateChapter = {
        chapter: {
          ...this.chapterForm.value
        }
      };

      const getChaptersRequest = {
        id: this.npc.id,
        published: false
      };

      this.store.dispatch(new UpdateChapter({
        placeId: this.place.id,
        npcId: this.npc.id,
        request: getChaptersRequest,
        npc: updateRequest
      }));
      this.chaptersTab.editing = false;
      this.cd.markForCheck();
    }
  }


}
