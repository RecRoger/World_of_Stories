import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { User, Place } from 'src/client-api';

@Component({
  selector: 'app-npc-builder',
  templateUrl: './npc-builder.component.html',
  styleUrls: ['./npc-builder.component.scss']
})
export class NpcBuilderComponent implements OnInit {

  user: User;
  npcs: any[] = [];

  npcsloading = false;
  npcsTabs: {
    npc?: string;
    tab: string;
    editing?: boolean;
    newTale?: boolean;
  }[] = [];
  newNpcTab: {
    newNpc?: boolean;
    tab?: string;
  } = { newNpc: false, tab: 'desc' };

  placeForm: FormGroup;

  @Input() place: Place;
  @Output() placeSelect: EventEmitter<Place> = new EventEmitter<Place>();

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private store: Store,
    private fb: FormBuilder,
  ) {
    this.user = this.store.selectSnapshot(UserState.getUser);
  }


  // al iniciar el componente, consulta todas las ciudades
  ngOnInit() {
    if (this.place) {
      this.getAllNpcs();
    }
  }
  async getAllNpcs() {
    this.npcsloading = true;
    this.cd.markForCheck();
    try {
      const req = null;
      req.ids = this.place.events;
      req.published = null;
      const resp = null; // TODO - Api de Stories
      if (resp.data.npcs) {
        this.npcs = resp.data.npcs;
        this.npcsTabs = [];
        this.npcs.forEach(element => {
          this.npcsTabs.push({ tab: 'desc' });
        });
      }

    } catch (err) {
      console.log('*** ERROR ***', err);
    }
    this.npcsloading = false;
    this.cd.markForCheck();

  }

  // Consultar todas los lugres
  /**
   * 
   // desplegar tarjeta del lugar
   toggleNpcInfo(i) {
     this.npcsTabs.forEach((tab, index) => {
       tab.place = (index !== i || tab.place === this.npcs[i]._id) ? null : this.npcs[i]._id;
     });
     this.newNpcTab.newNpc = false;
     this.cd.markForCheck();
   }
   // Cambiar la pagina de las descripciones o entrada
   changePage(index, mode) {
     (mode) ? this.npcsTabs[index].page++ : this.npcsTabs[index].page--;
     this.cd.markForCheck();
   }
 
   // habilitar la redaccion de nueva descripcion o entrada
   newTale(index: number) {
     this.placeForm = this.fb.group({
       tale: [null, [Validators.required]]
     });
     this.npcsTabs[index].editing = true;
     this.npcsTabs[index].newTale = true;
     this.cd.markForCheck();
   }
   // habilitar edicion de descripcion o entrada existente
   editTale(index: number) {
     const tale = (this.npcsTabs[index].tab === 'desc') ?
       this.npcs[index].description[this.npcsTabs[index].page].tale :
       this.npcs[index].entry[this.npcsTabs[index].page].tale;
     const taleId = (this.npcsTabs[index].tab === 'desc') ?
       this.npcs[index].description[this.npcsTabs[index].page]._id :
       this.npcs[index].entry[this.npcsTabs[index].page]._id;
     const published = (this.npcsTabs[index].tab === 'desc') ?
       this.npcs[index].description[this.npcsTabs[index].page].published :
       this.npcs[index].entry[this.npcsTabs[index].page].published;
 
     this.placeForm = this.fb.group({
       id: [taleId, [Validators.required]],
       tale: [tale, [Validators.required]],
       published: [published, [Validators.required]]
     });
     this.npcsTabs[index].editing = true;
     this.npcsTabs[index].newTale = false;
     this.cd.markForCheck();
 
   }
 
   // guardar edicion - nueva historia
   saveNpcEdition(index: number, cancel?) {
     if (cancel) {
       this.npcsTabs[index].editing = false;
       this.cd.markForCheck();
       return true;
     }
     if (this.placeForm.valid) {
       if (!this.npcsTabs[index].newTale) {
         // edicion de ...
         this.updateTale(index);
       } else {
         // nuevo ...
         this.addNewTale(index);
       }
       this.npcsTabs[index].editing = false;
       this.cd.markForCheck();
     } else {
       this.placeForm.get('tale').markAsTouched();
     }
   }
   // habilitar publicacion
   publishTale(index) {
     this.placeForm.get('published').setValue(!this.placeForm.get('published').value);
     this.updateTale(index);
   }
 
   // actualizar descripcion o viaje
   async updateTale(index) {
     this.npcsloading = true;
     this.cd.markForCheck();
     try {
       const data: TaleUpdate = new TaleUpdate();
       data.id = this.placeForm.get('id').value;
       data.tale = this.placeForm.get('tale').value;
       data.published = this.placeForm.get('published').value;
 
       const req: any = (this.npcsTabs[index].tab === 'desc') ?
         { description: data } :
         { entry: data };
 
       const url = (this.npcsTabs[index].tab === 'desc') ? UpdateNpcDescriptionURL : UpdateNpcEntryURL;
       const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
       this.getAllNpcs();
 
     } catch (err) {
       console.log('*** ERROR ***', err);
       this.npcsloading = false;
       this.cd.markForCheck();
     }
   }
   // guardar nueva descripcion o viaje
   async addNewTale(index) {
     this.npcsloading = true;
     this.cd.markForCheck();
     try {
       const req: AddNpcTaleRequest = new AddNpcTaleRequest();
       req.id = this.npcs[index]._id;
       req.tale = this.placeForm.get('tale').value;
       req.author = this.user.username;
 
       const url = (this.npcsTabs[index].tab === 'desc') ? addNpcDescriptionURL : addNpcEntryURL;
       const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
       this.getAllNpcs();
 
     } catch (err) {
       console.log('*** ERROR ***', err);
       this.npcsloading = false;
       this.cd.markForCheck();
     }
   }
   // eliminar descripcion o viaje
   async deleteTale(index) {
     this.npcsloading = true;
     this.cd.markForCheck();
     try {
       const req: RemoveNpcTaleRequest = new RemoveNpcTaleRequest();
       req.id = this.placeForm.get('id').value;
 
       const url = (this.npcsTabs[index].tab === 'desc') ? removeNpcDescriptionURL : removeNpcEntryURL;
       const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
       this.getAllNpcs();
 
     } catch (err) {
       console.log('*** ERROR ***', err);
       this.npcsloading = false;
       this.cd.markForCheck();
     }
   }
 
   toggleNewNpc() {
     this.npcsTabs.forEach(place => place.place = null);
 
     this.placeForm = this.fb.group({
       id: [this.city._id, [Validators.required]],
       userid: [this.user.username, [Validators.required]],
       name: ['', [Validators.required]],
       description: ['', [Validators.required]],
       entry: ['', [Validators.required]]
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
 
     if (this.placeForm.valid) {
       this.npcsloading = true;
       this.newNpcTab.newNpc = false;
       this.cd.markForCheck();
       try {
         let req: AddNpcRequest = new AddNpcRequest();
         req = { ... this.placeForm.value };
 
         const resp: ResponseModel<any> = await this.http.post(AddNpcURL, req).toPromise();
         this.getAllNpcs();
 
       } catch (err) {
         console.log('*** ERROR ***', err);
         this.npcsloading = false;
         this.cd.markForCheck();
       }
     } else {
       this.placeForm.get('userid').markAsTouched();
       this.placeForm.get('name').markAsTouched();
       this.placeForm.get('description').markAsTouched();
       this.placeForm.get('entry').markAsTouched();
       this.cd.markForCheck();
     }
   }
   // publicar ciudad
   async publishNpc(index: number) {
     this.npcsloading = true;
     this.cd.markForCheck();
     try {
       const req: PublishNpcRequest = new PublishNpcRequest();
       req.published = !this.npcs[index].published;
       req.id = this.npcs[index]._id;
 
       const resp: ResponseModel<UpdateResponse> = await this.http.post(publishNpcURL, req).toPromise();
       this.getAllNpcs();
 
     } catch (err) {
       console.log('*** ERROR ***', err);
       this.npcsloading = false;
       this.cd.markForCheck();
     }
   }
 
   selectNpc(i) {
     this.placeSelect.emit(this.npcs[i]);
   }
   * 
  */
  

}
