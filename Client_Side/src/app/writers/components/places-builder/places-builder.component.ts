import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { UserModel } from 'src/app/shared/models/client_models/user.model';
import { CityModel } from 'src/app/shared/models/client_models/city.model';
import { GetCityPlacesRequest, GetCityPlacesResponse } from 'src/app/shared/models/api_models/getPlaces.model';
import { ResponseModel } from 'src/app/shared/models/client_models/response.model';
import { getCityPlacesURL } from '../../../shared/models/api_models/getPlaces.model';
import { PlaceModel } from 'src/app/shared/models/client_models/place.model';
import { TaleUpdate, UpdateResponse } from 'src/app/shared/models/api_models/updateCity.model';
import {
  UpdatePlaceDescriptionURL,
  UpdatePlaceEntryURL,
  AddPlaceTaleRequest,
  addPlaceDescriptionURL,
  addPlaceEntryURL,
  RemovePlaceTaleRequest,
  removePlaceDescriptionURL,
  removePlaceEntryURL,
  PublishPlaceRequest,
  publishPlaceURL
} from 'src/app/shared/models/api_models/updatePlace.model';
import { AddPlaceRequest, AddPlaceURL } from 'src/app/shared/models/api_models/addPlace.model';

@Component({
  selector: 'app-places-builder',
  templateUrl: './places-builder.component.html',
  styleUrls: ['./places-builder.component.scss']
})
export class PlacesBuilderComponent implements OnInit {

  user: UserModel;
  places: PlaceModel[] = [];

  placesloading = false;
  placesTabs: {
    place?: string;
    tab: string;
    page: number;
    editing?: boolean;
    newTale?: boolean;
  }[] = [];
  newPlaceTab: {
    newPlace?: boolean;
    tab?: string;
  } = { newPlace: false, tab: 'desc' };

  placeForm: FormGroup;

  @Input() city: CityModel;
  @Output() placeSelect: EventEmitter<CityModel> = new EventEmitter<CityModel>();

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.user = this.userService.activeUserSnapchat;
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
    try {
      const req: GetCityPlacesRequest = new GetCityPlacesRequest();
      req.id = this.city._id;
      req.published = null;
      const resp: ResponseModel<GetCityPlacesResponse> = await this.http.post(getCityPlacesURL, req).toPromise();
      if (resp.data.places) {
        this.places = resp.data.places;
        this.placesTabs = [];
        this.places.forEach(element => {
          this.placesTabs.push({ tab: 'desc', page: 0 });
        });
      }

    } catch (err) {
      console.log('*** ERROR ***', err);
    }
    this.placesloading = false;
    this.cd.markForCheck();

  }

  // desplegar tarjeta del lugar
  togglePlaceInfo(i) {
    this.placesTabs.forEach((tab, index) => {
      tab.place = (index !== i || tab.place === this.places[i]._id) ? null : this.places[i]._id;
    });
    this.newPlaceTab.newPlace = false;
    this.cd.markForCheck();
  }
  // Cambiar la pagina de las descripciones o entrada
  changePage(index, mode) {
    (mode) ? this.placesTabs[index].page++ : this.placesTabs[index].page--;
    this.cd.markForCheck();
  }

  // habilitar la redaccion de nueva descripcion o entrada
  newTale(index: number) {
    this.placeForm = this.fb.group({
      tale: [null, [Validators.required]]
    });
    this.placesTabs[index].editing = true;
    this.placesTabs[index].newTale = true;
    this.cd.markForCheck();
  }
  // habilitar edicion de descripcion o entrada existente
  editTale(index: number) {
    const tale = (this.placesTabs[index].tab === 'desc') ?
      this.places[index].description[this.placesTabs[index].page].tale :
      this.places[index].entry[this.placesTabs[index].page].tale;
    const taleId = (this.placesTabs[index].tab === 'desc') ?
      this.places[index].description[this.placesTabs[index].page]._id :
      this.places[index].entry[this.placesTabs[index].page]._id;
    const published = (this.placesTabs[index].tab === 'desc') ?
      this.places[index].description[this.placesTabs[index].page].published :
      this.places[index].entry[this.placesTabs[index].page].published;

    this.placeForm = this.fb.group({
      id: [taleId, [Validators.required]],
      tale: [tale, [Validators.required]],
      published: [published, [Validators.required]]
    });
    this.placesTabs[index].editing = true;
    this.placesTabs[index].newTale = false;
    this.cd.markForCheck();

  }

  // guardar edicion - nueva historia
  savePlaceEdition(index: number, cancel?) {
    if (cancel) {
      this.placesTabs[index].editing = false;
      this.cd.markForCheck();
      return true;
    }
    if (this.placeForm.valid) {
      if (!this.placesTabs[index].newTale) {
        // edicion de ...
        this.updateTale(index);
      } else {
        // nuevo ...
        this.addNewTale(index);
      }
      this.placesTabs[index].editing = false;
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
    this.placesloading = true;
    this.cd.markForCheck();
    try {
      const data: TaleUpdate = new TaleUpdate();
      data.id = this.placeForm.get('id').value;
      data.tale = this.placeForm.get('tale').value;
      data.published = this.placeForm.get('published').value;

      const req: any = (this.placesTabs[index].tab === 'desc') ?
        { description: data } :
        { entry: data };

      const url = (this.placesTabs[index].tab === 'desc') ? UpdatePlaceDescriptionURL : UpdatePlaceEntryURL;
      const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
      this.getAllPlaces();

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.placesloading = false;
      this.cd.markForCheck();
    }
  }
  // guardar nueva descripcion o viaje
  async addNewTale(index) {
    this.placesloading = true;
    this.cd.markForCheck();
    try {
      const req: AddPlaceTaleRequest = new AddPlaceTaleRequest();
      req.id = this.places[index]._id;
      req.tale = this.placeForm.get('tale').value;
      req.author = this.user.username;

      const url = (this.placesTabs[index].tab === 'desc') ? addPlaceDescriptionURL : addPlaceEntryURL;
      const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
      this.getAllPlaces();

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.placesloading = false;
      this.cd.markForCheck();
    }
  }
  // eliminar descripcion o viaje
  async deleteTale(index) {
    this.placesloading = true;
    this.cd.markForCheck();
    try {
      const req: RemovePlaceTaleRequest = new RemovePlaceTaleRequest();
      req.id = this.placeForm.get('id').value;

      const url = (this.placesTabs[index].tab === 'desc') ? removePlaceDescriptionURL : removePlaceEntryURL;
      const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
      this.getAllPlaces();

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.placesloading = false;
      this.cd.markForCheck();
    }
  }

  toggleNewPlace() {
    this.placesTabs.forEach(place => place.place = null);

    this.placeForm = this.fb.group({
      id: [this.city._id, [Validators.required]],
      userid: [this.user.username, [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      entry: ['', [Validators.required]]
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

    if (this.placeForm.valid) {
      this.placesloading = true;
      this.newPlaceTab.newPlace = false;
      this.cd.markForCheck();
      try {
        let req: AddPlaceRequest = new AddPlaceRequest();
        req = { ... this.placeForm.value };

        const resp: ResponseModel<any> = await this.http.post(AddPlaceURL, req).toPromise();
        this.getAllPlaces();

      } catch (err) {
        console.log('*** ERROR ***', err);
        this.placesloading = false;
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
  async publishPlace(index: number) {
    this.placesloading = true;
    this.cd.markForCheck();
    try {
      const req: PublishPlaceRequest = new PublishPlaceRequest();
      req.published = !this.places[index].published;
      req.id = this.places[index]._id;

      const resp: ResponseModel<UpdateResponse> = await this.http.post(publishPlaceURL, req).toPromise();
      this.getAllPlaces();

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.placesloading = false;
      this.cd.markForCheck();
    }
  }

  selectPlace(i) {
    this.placeSelect.emit(this.places[i]);
  }

}
