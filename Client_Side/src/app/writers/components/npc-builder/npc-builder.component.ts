import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store, Select } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { User, Place, Npc, RequestNewNpc, ReadFragment, Decision, RequestPublishNpc } from 'wos-api';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { map } from 'rxjs/operators';
import { NpcTabs } from 'src/app/shared/constants';
import { isValid } from 'src/app/shared/utils/commons';
import { NewNpc, PublishNpc, UpdateNpc, GetNpcData } from 'src/app/shared/store/stories/stories.actions';
import { faCloudUploadAlt, faCloudDownloadAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-npc-builder',
  templateUrl: './npc-builder.component.html',
  styleUrls: ['./npc-builder.component.scss']
})
export class NpcBuilderComponent implements OnInit {

  user: User;

  @Select(StoriesState.getNpcs) allNpcs$: Observable<any>;
  get npcs$(): Observable<Npc[]> {
    return this.allNpcs$.pipe(map(filterFn => filterFn(this.place.id)));
  }

  npcsTabs: {
    npc?: string;
    loading?: boolean
    tab: NpcTabs;
    editing?: boolean;
    newTale?: boolean;
  };
  newNpcTab: {
    loading?: boolean;
    newNpc?: boolean;
    tab?: string;
  } = { newNpc: false, tab: 'desc' };

  npcForm: FormGroupTyped<NewNpcFormData>;

  @Input() place: Place;
  @Output() npcSelect: EventEmitter<string> = new EventEmitter<string>();


  faUpload = faCloudUploadAlt;
  faDownload = faCloudDownloadAlt;
  faEdit = faEdit;

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private fb: FormBuilder,
  ) {
    this.user = this.store.selectSnapshot(UserState.getUser);
  }


  // al iniciar el componente, consulta todas las ciudades
  ngOnInit() {

  }

  // desplegar tarjeta del Npc
  async toggleNpcInfo(id: string) {

    if (this.npcsTabs && id === this.npcsTabs.npc) {
      this.npcsTabs = null;
    } else {
      this.npcsTabs = {
        loading: true,
        npc: id,
        tab: NpcTabs.descripcion
      };
      this.cd.markForCheck();
      await this.store.dispatch(new GetNpcData({ npcId: id, placeId: this.place.id, force: false })).toPromise();
      this.npcsTabs.loading = false;

    }
    this.newNpcTab.newNpc = false;
    this.cd.markForCheck();

  }

  //  // habilitar edicion de descripcion o entrada existente
  editTale(npc: Npc) {

    this.npcForm = this.fb.group({
      id: [npc.id],
      name: [npc.name, [Validators.required]], // string;
      description: [npc.description.tale, [Validators.required]], // Array<ReadFragment>;
      meeting: [npc.meeting.tale, [Validators.required]], // Array<ReadFragment>;
      decision: [npc.decision, [Validators.required]], // Decision;
      rejected: [npc.rejected.tale, [Validators.required]], // Array<ReadFragment>;
      author: [this.user.username, [Validators.required]] // string;
    });

    this.npcsTabs.editing = true;
    this.cd.markForCheck();
  }

  // guardar edicion - nueva historia
  saveNpcEdition(index: number, cancel?) {
    if (cancel) {
      this.npcsTabs.editing = false;
      this.cd.markForCheck();
      return true;
    }
    if (isValid(this.npcForm)) {

      const changes = {
        author: this.npcForm.value.author
      };

      switch (this.npcsTabs.tab) {
        case NpcTabs.descripcion:
          changes['description'] = this.npcForm.value.description;
          break;
        case NpcTabs.meeting:
          changes['meeting'] = this.npcForm.value.meeting;
          break;
        case NpcTabs.reject:
          changes['rejected'] = this.npcForm.value.rejected;
          break;
        case NpcTabs.decision:
          changes['decision'] = this.npcForm.value.decision;
          break;
      }

      this.store.dispatch(new UpdateNpc({ placeId: this.place.id, npcId: this.npcForm.value.id, npc: changes }));
      this.npcsTabs.editing = false;
      this.cd.markForCheck();
    }
  }

  toggleNewNpc() {
    this.npcsTabs = null;

    this.npcForm = this.fb.group({
      name: ['', [Validators.required]],
      npcType: ['story', [Validators.required]],
      description: [[], [Validators.required]],
      meeting: [[], [Validators.required]],
      decision: [null, [Validators.required]],
      rejected: [[], [Validators.required]],
      // title: ['', [Validators.required]],
      author: [this.user.username, [Validators.required]]
    });

    this.newNpcTab.newNpc = !this.newNpcTab.newNpc;
    this.newNpcTab.tab = 'desc';
    this.cd.markForCheck();
  }

  async addNewNpc(cancel) {
    if (cancel) {
      this.newNpcTab.newNpc = false;
      this.cd.markForCheck();
      return null;
    }

    if (isValid(this.npcForm)) {
      // this.placesloading = true;
      this.newNpcTab.newNpc = false;
      this.newNpcTab.loading = true;
      this.cd.markForCheck();

      const req: RequestNewNpc = {
        placeId: this.place.id,
        npc: {
          ...this.npcForm.value
        }
      };

      console.log('se supone esto es el request', req);

      await this.store.dispatch(new NewNpc(req)).toPromise();
      this.newNpcTab.loading = false;
    }
  }

  // publicar Npc
  async publishNpc(id: string, published: boolean) {
    const req: RequestPublishNpc = {
      id,
      published
    };

    await this.store.dispatch(new PublishNpc({ placeId: this.place.id, req }));
  }

  selectNpc(id) {
    this.npcSelect.emit(id);
  }

  takeNpcDecision(npc, value) {
    if (value === 'true') {
      this.selectNpc(npc.id);
    } else {
      this.npcsTabs.tab = NpcTabs.reject;
      this.cd.markForCheck();
    }
  }


}

class NewNpcFormData {
  id?: string;
  name?: string;
  npcType?: string;
  description?: Array<ReadFragment>;
  meeting?: Array<ReadFragment>;
  decision?: Decision;
  rejected?: Array<ReadFragment>;
  title?: string;
  author?: string;

  items?: Array<string>;

}
