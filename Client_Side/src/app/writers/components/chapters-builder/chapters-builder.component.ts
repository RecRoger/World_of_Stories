import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { User, Chapter, Place, Npc, ChapterUpdate, RequestUpdateChapter, RequestPublishChapter, City } from 'wos-api';
import { Select, Store } from '@ngxs/store';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { map } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { isValid } from 'src/app/shared/utils/commons';
import { UpdateChapter, PublishChapter, GetChapterData, UpdateNpc, GetNpcStory } from 'src/app/shared/store/stories/stories.actions';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { faCloudUploadAlt, faCloudDownloadAlt, faEdit, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { GetAllPlaces } from 'src/app/shared/store/locations/locations.actions';

@Component({
  selector: 'app-chapters-builder',
  templateUrl: './chapters-builder.component.html',
  styleUrls: ['./chapters-builder.component.scss']
})
export class ChaptersBuilderComponent implements OnInit, OnDestroy {

  user: User;

  @Select(StoriesState.getStory) allChapters$: Observable<any>;
  get chapters$(): Observable<Chapter[]> {
    return this.allChapters$.pipe(map(filterFn => filterFn(this.place.id, this.npc.id)));
  }

  @Input() place: Place;
  @Input() npc: Npc;

  chaptersTab: {
    chapters?: string[];
    loading?: string[]
    editing?: boolean;
    editingTitle?: boolean;
    endChapter?: false;
  } = { chapters: [] };

  titleForm: FormGroup;
  chapterForm: FormGroupTyped<ChapterUpdate>;
  cities = [];
  places = [];

  faUpload = faCloudUploadAlt;
  faDownload = faCloudDownloadAlt;
  faEdit = faEdit;
  faPen = faPen;
  faCheck = faCheck;

  subcription: Subscription;

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.user = this.store.selectSnapshot(UserState.getUser);
    this.cities = this.store.selectSnapshot(LocationState.getCities).map(l => ({ name: l.name, value: l.id }));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subcription) { this.subcription.unsubscribe(); }
  }

  async toggleChapterInfo(id: string) {
    if (!this.chaptersTab || !this.chaptersTab.editing) {
      if (this.chaptersTab && this.chaptersTab.chapters.includes(id)) {
        this.chaptersTab.chapters = this.chaptersTab.chapters.filter(i => i !== id);
      } else {
        this.chaptersTab.chapters = [id];
        this.chaptersTab.loading = [id];
        this.chaptersTab.editing = false;
        this.chaptersTab.endChapter = false;

        await this.store.dispatch(new GetChapterData({ placeId: this.place.id, chapterId: id, npcId: this.npc.id })).toPromise();
        this.chaptersTab.loading = this.chaptersTab.loading.filter(i => i !== id);
        this.cd.markForCheck();

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
          endChapter: chapter.endLocation && chapter.endLocation.endChapter,
          cityId: [chapter.endLocation && chapter.endLocation.cityId || null, []],
          placeId: [chapter.endLocation && chapter.endLocation.placeId || null, []]
        }),
        usersDecisions: [chapter.usersDecisions || {}, [Validators.required]],
        author: [this.user.username, [Validators.required]]
      });
      this.subcription = this.chapterForm.get('endLocation').get('cityId').valueChanges.subscribe(async (val: string) => {
        const store = await this.store.dispatch(new GetAllPlaces({ request: { cityId: val } })).toPromise();
        const cities: City[] = store.locations && store.locations.cities || [];
        const city: City = cities.find(c => c.id === val);
        this.places = city && city.places && city.places.map(l => ({ name: l.name, value: l.id })) || [];
        this.cd.markForCheck();

      });

    }
    this.chaptersTab.editing = !this.chaptersTab.editing;
    this.cd.markForCheck();

  }

  async saveChapterEdition(cancel?) {
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

      await this.store.dispatch(new UpdateChapter({
        placeId: this.place.id,
        npcId: this.npc.id,
        request: getChaptersRequest,
        npc: updateRequest
      })).toPromise();
      this.chaptersTab.editing = false;
      this.cd.markForCheck();
    }
  }

  async publishChapter(id: string, published: boolean) {

    const req: RequestPublishChapter = {
      id,
      published
    };

    await this.store.dispatch(new PublishChapter({ placeId: this.place.id, npcId: this.npc.id, chapter: req })).toPromise();

  }

  endStoryAnimation() {
    // console.log('aca llego');
  }

  async editStoryTitle() {
    if (!this.chaptersTab.editingTitle) {
      this.titleForm = this.fb.group({
        id: [this.npc.id],
        title: [this.npc && this.npc.title, [Validators.required]]
      });
      this.chaptersTab.editingTitle = true;
      this.cd.markForCheck();
    } else {
      if (isValid(this.titleForm)) {
        const store = await this.store.dispatch(new UpdateNpc({ placeId: this.place.id, npcId: this.npc.id, npc: { ...this.titleForm.value } })).toPromise();
        const npcs: Npc[] = store.stories[this.place.id];
        this.npc = npcs.find(n => n.id === this.npc.id);
        await this.store.dispatch(new GetNpcStory({ placeId: this.place.id, npcId: this.npc.id, request: { id: this.npc.id } })).toPromise();
        this.chaptersTab.editingTitle = false;
        this.chaptersTab.chapters = [];
        this.cd.markForCheck();
      }
    }
  }


}
