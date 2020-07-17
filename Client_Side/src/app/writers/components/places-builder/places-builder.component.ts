import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { User, Place, City, RequestGetPlaces, ReadFragment } from 'src/client-api';
import { PlaceTabs } from 'src/app/shared/constants';
import { GetAllPlaces } from 'src/app/shared/store/locations/locations.actions';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-places-builder',
  templateUrl: './places-builder.component.html',
  styleUrls: ['./places-builder.component.scss']
})
export class PlacesBuilderComponent implements OnInit {

  user: User;

  @Select(LocationState.getPlaces) allPlaces$: Observable<any>;
  get places$(): Observable<Place[]> {
    return this.allPlaces$.pipe(map(filterFn => filterFn(this.city.id)));
  }


  // places: Place[] = [];

  placesloading = false;
  placesTabs: {
    place?: string;
    tab: PlaceTabs;
    page: number;
    editing?: boolean;
    newTale?: boolean;
  };
  newPlaceTab: {
    loading?: boolean;
    newPlace?: boolean;
    tab?: string;
  } = { newPlace: false, tab: 'desc' };

  placeForm: FormGroupTyped<NewPlaceFormData>;

  @Input() city: City;
  @Output() placeSelect: EventEmitter<City> = new EventEmitter<City>();

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private store: Store
  ) {
    this.user = this.store.selectSnapshot(UserState.getUser);
  }


  // al iniciar el componente, consulta todas las ciudades
  ngOnInit() {
    if (this.city) {
      this.getAllPlaces();
    }
  }

  // Consultar todas los lugres
  async getAllPlaces() {
    this.placesloading = true;
    this.cd.markForCheck();

    this.store.dispatch(new GetAllPlaces({
      cityId: this.city.id,
      published: false
    }));

    this.placesloading = false;
    this.cd.markForCheck();

  }





  // desplegar tarjeta del lugar
  togglePlaceInfo(id) {
    if (this.placesTabs && id === this.placesTabs.place) {
      this.placesTabs = null;
    } else {
      this.placesTabs = {
        place: id,
        tab: PlaceTabs.descripcion,
        page: 0,
      };
    }
    this.newPlaceTab.newPlace = false;
    this.cd.markForCheck();
  }


  // Cambiar la pagina de las descripciones o entrada
  changePage(index, mode) {
    (mode) ? this.placesTabs.page++ : this.placesTabs.page--;
    this.cd.markForCheck();
  }

  // // habilitar la redaccion de nueva descripcion o entrada
  // newTale(index: number) {
  //   this.placeForm = this.fb.group({
  //     tale: [null, [Validators.required]]
  //   });
  //   this.placesTabs[index].editing = true;
  //   this.placesTabs[index].newTale = true;
  //   this.cd.markForCheck();
  // }
  // // habilitar edicion de descripcion o entrada existente
  // editTale(index: number) {
  //   const tale = (this.placesTabs[index].tab === 'desc') ?
  //     this.places[index].description[this.placesTabs[index].page].tale :
  //     this.places[index].entry[this.placesTabs[index].page].tale;
  //   const taleId = (this.placesTabs[index].tab === 'desc') ?
  //     this.places[index].description[this.placesTabs[index].page].id :
  //     this.places[index].entry[this.placesTabs[index].page].id;
  //   const published = (this.placesTabs[index].tab === 'desc') ?
  //     this.places[index].description[this.placesTabs[index].page].published :
  //     this.places[index].entry[this.placesTabs[index].page].published;

  //   this.placeForm = this.fb.group({
  //     id: [taleId, [Validators.required]],
  //     tale: [tale, [Validators.required]],
  //     published: [published, [Validators.required]]
  //   });
  //   this.placesTabs[index].editing = true;
  //   this.placesTabs[index].newTale = false;
  //   this.cd.markForCheck();

  // }

  // // guardar edicion - nueva historia
  // savePlaceEdition(index: number, cancel?) {
  //   if (cancel) {
  //     this.placesTabs[index].editing = false;
  //     this.cd.markForCheck();
  //     return true;
  //   }
  //   if (this.placeForm.valid) {
  //     if (!this.placesTabs[index].newTale) {
  //       // edicion de ...
  //       this.updateTale(index);
  //     } else {
  //       // nuevo ...
  //       this.addNewTale(index);
  //     }
  //     this.placesTabs[index].editing = false;
  //     this.cd.markForCheck();
  //   } else {
  //     this.placeForm.get('tale').markAsTouched();
  //   }
  // }
  // // habilitar publicacion
  // publishTale(index) {
  //   this.placeForm.get('published').setValue(!this.placeForm.get('published').value);
  //   this.updateTale(index);
  // }

  // // actualizar descripcion o viaje
  // async updateTale(index) {
  //   this.placesloading = true;
  //   this.cd.markForCheck();
  //   try {
  //     // const data: TaleUpdate = new TaleUpdate();
  //     // data.id = this.placeForm.get('id').value;
  //     // data.tale = this.placeForm.get('tale').value;
  //     // data.published = this.placeForm.get('published').value;

  //     // const req: any = (this.placesTabs[index].tab === 'desc') ?
  //     //   { description: data } :
  //     //   { entry: data };

  //     // const url = (this.placesTabs[index].tab === 'desc') ? UpdatePlaceDescriptionURL : UpdatePlaceEntryURL;
  //     // const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
  //     // this.getAllPlaces();

  //   } catch (err) {
  //     console.log('*** ERROR ***', err);
  //     this.placesloading = false;
  //     this.cd.markForCheck();
  //   }
  // }
  // // guardar nueva descripcion o viaje
  // async addNewTale(index) {
  //   this.placesloading = true;
  //   this.cd.markForCheck();
  //   try {
  //     // const req: AddPlaceTaleRequest = new AddPlaceTaleRequest();
  //     // req.id = this.places[index].id;
  //     // req.tale = this.placeForm.get('tale').value;
  //     // req.author = this.user.username;

  //     // const url = (this.placesTabs[index].tab === 'desc') ? addPlaceDescriptionURL : addPlaceEntryURL;
  //     // const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
  //     // this.getAllPlaces();

  //   } catch (err) {
  //     console.log('*** ERROR ***', err);
  //     this.placesloading = false;
  //     this.cd.markForCheck();
  //   }
  // }
  // // eliminar descripcion o viaje
  // async deleteTale(index) {
  //   this.placesloading = true;
  //   this.cd.markForCheck();
  //   try {
  //     // const req: RemovePlaceTaleRequest = new RemovePlaceTaleRequest();
  //     // req.id = this.placeForm.get('id').value;

  //     // const url = (this.placesTabs[index].tab === 'desc') ? removePlaceDescriptionURL : removePlaceEntryURL;
  //     // const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
  //     // this.getAllPlaces();

  //   } catch (err) {
  //     console.log('*** ERROR ***', err);
  //     this.placesloading = false;
  //     this.cd.markForCheck();
  //   }
  // }



  toggleNewPlace() {
    this.placesTabs = null;

    this.placeForm = this.fb.group({
      cityId: [this.city.id, [Validators.required]],
      userName: [this.user.username, [Validators.required]],
      name: ['', [Validators.required]],
      description: [[], [Validators.required]],
      entry: [[], [Validators.required]]
    });

    this.newPlaceTab.newPlace = !this.newPlaceTab.newPlace;
    this.newPlaceTab.tab = 'desc';
    this.cd.markForCheck();
  }

  // async addNewPlace(cancel) {
  //   if (cancel) {
  //     this.newPlaceTab.newPlace = false;
  //     this.cd.markForCheck();
  //     return null;
  //   }

  //   if (this.placeForm.valid) {
  //     this.placesloading = true;
  //     this.newPlaceTab.newPlace = false;
  //     this.cd.markForCheck();
  //     try {
  //       // let req: AddPlaceRequest = new AddPlaceRequest();
  //       // req = { ... this.placeForm.value };

  //       // const resp: ResponseModel<any> = await this.http.post(AddPlaceURL, req).toPromise();
  //       // this.getAllPlaces();

  //     } catch (err) {
  //       console.log('*** ERROR ***', err);
  //       this.placesloading = false;
  //       this.cd.markForCheck();
  //     }
  //   } else {
  //     this.placeForm.get('userid').markAsTouched();
  //     this.placeForm.get('name').markAsTouched();
  //     this.placeForm.get('description').markAsTouched();
  //     this.placeForm.get('entry').markAsTouched();
  //     this.cd.markForCheck();
  //   }
  // }
  
  // // publicar ciudad
  // async publishPlace(index: number) {
  //   this.placesloading = true;
  //   this.cd.markForCheck();
  //   try {
  //     // const req: PublishPlaceRequest = new PublishPlaceRequest();
  //     // req.published = !this.places[index].published;
  //     // req.id = this.places[index].id;

  //     // const resp: ResponseModel<UpdateResponse> = await this.http.post(publishPlaceURL, req).toPromise();
  //     // this.getAllPlaces();

  //   } catch (err) {
  //     console.log('*** ERROR ***', err);
  //     this.placesloading = false;
  //     this.cd.markForCheck();
  //   }
  // }

  // selectPlace(i) {
  //   this.placeSelect.emit(this.places[i]);
  // }

}

class NewPlaceFormData {
  // para nuevos relatos de ciudades existentes
  id?: string;
  tale?: ReadFragment[];
  published?: boolean;

  // para las nuevas ciudades
  userName?: string;
  name?: string;
  description?: ReadFragment[];
  travel?: ReadFragment[];
}