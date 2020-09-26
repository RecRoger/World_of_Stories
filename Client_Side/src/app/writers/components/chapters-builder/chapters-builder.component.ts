import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { User, Chapter, Place, Npc, ChapterUpdate, RequestUpdateChapter, RequestPublishChapter, City } from 'wos-api';
import { Select, Store } from '@ngxs/store';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { map } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { isValid } from 'src/app/shared/utils/commons';
import { UpdateChapter, PublishChapter, GetChapterData, UpdateNpc, GetNpcStory, DivideChapter } from 'src/app/shared/store/stories/stories.actions';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { faCloudUploadAlt, faCloudDownloadAlt, faEdit, faPen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { GetAllPlaces } from 'src/app/shared/store/locations/locations.actions';
import { ChapterDividerModel } from 'src/app/shared/components/animated-fragment/animated-fragment.component';

@Component({
  selector: 'app-chapters-builder',
  templateUrl: './chapters-builder.component.html',
  styleUrls: ['./chapters-builder.component.scss']
})
export class ChaptersBuilderComponent implements OnInit, OnDestroy {

  user: User;

  @Select(StoriesState.getStory) allChapters$: Observable<any>;
  get chapters$(): Observable<Chapter[]> {
    return this.allChapters$.pipe(map(filterFn => filterFn(this.place && this.place.id, this.npc && this.npc.id)));
  }

  @Input() place: Place;
  @Input() npc: Npc;

  chaptersTab: {
    options?: string[];
    loading?: string[]
    editing?: string;
    editingTitle?: boolean;
    endChapter?: false;
  } = { options: [], loading: [] };

  titleForm: FormGroup;
  chapterForm: FormGroupTyped<ChapterUpdate>;
  cities = [];
  places = [];
  chapters: Chapter[] = [];
  shownChapters: Chapter[];

  faUpload = faCloudUploadAlt;
  faDownload = faCloudDownloadAlt;
  faEdit = faEdit;
  faPen = faPen;
  faCheck = faCheck;
  faTimes = faTimes;

  formSubcription: Subscription;
  chapterSubcription: Subscription;

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.user = this.store.selectSnapshot(UserState.getUser);
    this.cities = this.store.selectSnapshot(LocationState.getCities).map(l => ({ name: l.name, value: l.id }));
    this.chapterSubcription = this.chapters$.subscribe(async chapList => {
      this.chapters = chapList;
      if (this.chapters.length !== 0 && !this.shownChapters) {
        this.shownChapters = [];
        this.chaptersTab.options = [];
        await this.toggleChapterInfo(this.chapters[0].id);
      }
    });
  }

  async ngOnInit() {

  }

  ngOnDestroy() {
    if (this.formSubcription) { this.formSubcription.unsubscribe(); }
    if (this.chapterSubcription) { this.chapterSubcription.unsubscribe(); }
  }

  async toggleChapterInfo(id: string, startChapter?: Chapter) {
    if (!this.chaptersTab.editing) {
      this.chaptersTab.editing = null;
      this.chaptersTab.endChapter = false;

      if (startChapter) {
        const index = this.shownChapters.findIndex(c => c.id === startChapter.id);
        this.shownChapters = this.shownChapters.slice(0, index + 1);
        this.chaptersTab.options = this.chaptersTab.options.slice(0, index + 1);
      }

      this.chaptersTab.loading.push(id);
      await this.store.dispatch(new GetChapterData({ placeId: this.place.id, chapterId: id, npcId: this.npc.id })).toPromise();
      this.chaptersTab.loading = this.chaptersTab.loading.filter(i => i !== id);

      const nextChapter = this.chapters.find(chap => chap.id === id);
      this.shownChapters.push(nextChapter);


      this.cd.markForCheck();
    }
  }

  editChapter(chapter: Chapter) {
    if (!this.chaptersTab.editing) {
      this.chapterForm = this.fb.group({
        id: [chapter.id, [Validators.required]],
        name: [chapter.name, []],
        story: [chapter.story || [], [Validators.required]],
        item: [chapter.items || [], []],
        endLocation: this.fb.group({
          endChapter: (chapter.endLocation && chapter.endLocation.endChapter) || false,
          cityId: [chapter.endLocation && chapter.endLocation.cityId || null, []],
          placeId: [chapter.endLocation && chapter.endLocation.placeId || null, []]
        }),
        usersDecisions: [chapter.usersDecisions || {}, [Validators.required]],
        author: [this.user.username, [Validators.required]]
      });
      this.formSubcription = this.chapterForm.get('endLocation').get('cityId').valueChanges.subscribe(async (val: string) => {
        const store = await this.store.dispatch(new GetAllPlaces({ request: { cityId: val } })).toPromise();
        const cities: City[] = store.locations && store.locations.cities || [];
        const city: City = cities.find(c => c.id === val);
        this.places = city && city.places && city.places.map(l => ({ name: l.name, value: l.id })) || [];
        this.cd.markForCheck();

      });

    }
    this.chaptersTab.editing = chapter.id;
    this.cd.markForCheck();

  }

  async saveChapterEdition(cancel?) {
    if (cancel) {
      this.chaptersTab.editing = null;
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

      const editedChapter = this.shownChapters.find(c => c.id === this.chaptersTab.editing);
      const editedIndex = this.shownChapters.findIndex(c => c.id === this.chaptersTab.editing);
      this.chaptersTab.editing = null;

      if (!editedIndex) {
        this.shownChapters = [];
        this.toggleChapterInfo(editedChapter.id);
      } else {
        this.toggleChapterInfo(editedChapter.id, this.shownChapters[editedIndex - 1]);
      }

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

  endStoryAnimation(chapter: Chapter) {
    if (!chapter.endLocation.endChapter && chapter.usersDecisions.options) {
      this.chaptersTab.options.push(chapter.id);
    }
    if (!chapter.endLocation.endChapter && chapter.usersDecisions.options && chapter.usersDecisions.options[0].value) {
      const chapterAlreadyExist = this.shownChapters.find(chap => chap.id === chapter.usersDecisions.options[0].value);
      if (!chapterAlreadyExist) {
        this.toggleChapterInfo(chapter.usersDecisions.options[0].value);
      }
    }
  }

  async editStoryTitle(cancel?) {
    if (cancel) {
      this.chaptersTab.editingTitle = false;
      this.cd.markForCheck();
      return;
    }

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
        this.cd.markForCheck();
      }
    }

  }

  async addDivision(chapter: Chapter, divider: ChapterDividerModel) {

    await this.store.dispatch(new DivideChapter({ placeId: this.place.id, npcId: this.npc.id, chapter, division: divider })).toPromise();

    this.shownChapters = [];
    this.chaptersTab.options = [];
    this.toggleChapterInfo(this.chapters[0].id);
  }


}
