import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { User, Place, City, RequestGetPlaces, ReadFragment, RequestNewPlace, RequestPublishPlace, NewPlaceTale, TaleEdition } from 'wos-api';
import { PlaceTabs } from 'src/app/shared/constants';
import { GetAllPlaces, NewPlace, PublishPlace, AddPlaceStory, EditPlaceStory, DeletePlaceStory, GetPlaceData } from 'src/app/shared/store/locations/locations.actions';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { map, take } from 'rxjs/operators';
import { isValid } from 'src/app/shared/utils/commons';
import { faCloudUploadAlt, faCloudDownloadAlt, faEdit, faChevronLeft, faChevronRight, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

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
    loading?: boolean;
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
  @Output() placeSelect: EventEmitter<string> = new EventEmitter<string>();


  faUpload = faCloudUploadAlt;
  faDownload = faCloudDownloadAlt;
  faEdit = faEdit;
  faLeft = faChevronLeft;
  faRight = faChevronRight;
  faPlus = faPlus;
  faTimes = faTimes;

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private store: Store
  ) {
    this.user = this.store.selectSnapshot(UserState.getUser);
  }


  // al iniciar el componente, consulta todas las ciudades
  ngOnInit() {
  }



  // desplegar tarjeta del lugar
  async togglePlaceInfo(id) {
    if (this.placesTabs && id === this.placesTabs.place) {
      this.placesTabs = null;
    } else {
      this.placesTabs = {
        place: id,
        loading: true,
        tab: PlaceTabs.descripcion,
        page: 0,
      };

      await this.store.dispatch(new GetPlaceData({ cityId: this.city.id, placeId: id, force: false })).toPromise();
      this.placesTabs.loading = false;
      this.cd.markForCheck();

    }
    this.newPlaceTab.newPlace = false;
    this.cd.markForCheck();
  }
  // Cambiar la pagina de las descripciones o entrada
  changePage(index, mode) {
    (mode) ? this.placesTabs.page++ : this.placesTabs.page--;
    this.cd.markForCheck();
  }

  // habilitar la redaccion de nueva descripcion o entrada
  newTale() {
    this.placeForm = this.fb.group({
      tale: [[], [Validators.required]]
    });
    this.placesTabs.editing = true;
    this.placesTabs.newTale = true;
    this.cd.markForCheck();
  }
  // habilitar edicion de descripcion o entrada existente
  editTale(id: string) {

    this.places$.pipe(take(1)).subscribe(places => {
      const place = places.find(p => p.id === id);

      const tale = (this.placesTabs.tab === 'desc') ?
        place.description[this.placesTabs.page].tale :
        place.entry[this.placesTabs.page].tale;
      const taleId = (this.placesTabs.tab === 'desc') ?
        place.description[this.placesTabs.page].id :
        place.entry[this.placesTabs.page].id;
      const published = (this.placesTabs.tab === 'desc') ?
        place.description[this.placesTabs.page].published :
        place.entry[this.placesTabs.page].published;

      this.placeForm = this.fb.group({
        id: [taleId, [Validators.required]],
        tale: [tale, [Validators.required]],
        published: [published, [Validators.required]]
      });
      this.placesTabs.editing = true;
      this.placesTabs.newTale = false;
      this.cd.markForCheck();
    });


  }

  // guardar edicion - nueva historia
  savePlaceEdition(id: string, cancel?) {
    if (cancel) {
      this.placesTabs.editing = false;
      this.cd.markForCheck();
      return true;
    }
    if (isValid(this.placeForm)) {
      if (!this.placesTabs.newTale) {
        // edicion de ...
        this.updateTale(id);
      } else {
        // nuevo ...
        this.addNewTale(id);
      }
      this.placesTabs.editing = false;
      this.cd.markForCheck();
    } else {
      this.placeForm.get('tale').markAsTouched();
    }
  }


  // habilitar publicacion
  publishTale(placeId) {
    this.placeForm.get('published').setValue(!this.placeForm.get('published').value);
    this.updateTale(placeId);
  }

  // actualizar descripcion o viaje
  async updateTale(placeId) {
    // this.placesloading = true;
    this.placesTabs.loading = true;
    this.cd.markForCheck();

    const data: TaleEdition = {
      id: this.placeForm.get('id').value,
      tale: this.placeForm.get('tale').value,
      published: this.placeForm.get('published').value,

    };

    await this.store.dispatch(new EditPlaceStory({
      type: this.placesTabs.tab,
      cityId: this.city.id,
      placeId,
      tale: data,
    }));

    this.placesTabs.loading = false;
    this.placesTabs.editing = false;

  }
  // guardar nueva descripcion o viaje
  async addNewTale(id) {

    const req: NewPlaceTale = {
      placeId: id,
      tale: this.placeForm.get('tale').value,
      author: this.user.username,
    };

    await this.store.dispatch(new AddPlaceStory({ cityId: this.city.id, type: this.placesTabs.tab, placeId: id, tale: req })).toPromise();

    this.places$.pipe(take(1)).subscribe(places => {
      const place = places.find(p => p.id === id);

      this.placesTabs.editing = false;
      this.placesTabs.page = (this.placesTabs.tab === PlaceTabs.descripcion) ? place.description.length - 1 : place.entry.length - 1;
    });

  }
  // eliminar descripcion o viaje
  async deleteTale(id) {
    // this.placesloading = true;

    await this.store.dispatch(new DeletePlaceStory({
      cityId: this.city.id,
      placeId: id,
      taleId: this.placeForm.get('id').value,
      type: this.placesTabs.tab
    })).toPromise();

    this.placesTabs.editing = false;
    this.placesTabs.page = 0;

  }



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

  async addNewPlace(cancel) {
    if (cancel) {
      this.newPlaceTab.newPlace = false;
      this.cd.markForCheck();
      return null;
    }

    if (isValid(this.placeForm)) {
      // this.placesloading = true;
      this.newPlaceTab.newPlace = false;
      this.newPlaceTab.loading = true;
      this.cd.markForCheck();

      const req: RequestNewPlace = {
        ... this.placeForm.value
      };

      await this.store.dispatch(new NewPlace(req)).toPromise();
      this.newPlaceTab.loading = false;
    }
  }

  // publicar ciudad
  async publishPlace(id: string, published: boolean) {

    const req: RequestPublishPlace = {
      id,
      published
    };

    await this.store.dispatch(new PublishPlace({ cityId: this.city.id, place: req }));
  }

  selectPlace(place: Place) {
    this.placeSelect.emit(place.id);
  }

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
