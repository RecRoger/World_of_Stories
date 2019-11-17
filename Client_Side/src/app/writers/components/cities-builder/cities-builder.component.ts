import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from 'src/app/shared/models/client_models/response.model';
import { getAllCitiesURL, GetAllCitiesResponse, GetAllCitiesRequest } from 'src/app/shared/models/api_models/getAllCities.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CityModel } from 'src/app/shared/models/client_models/city.model';
import {
  PublishCityRequest,
  UpdateResponse,
  publishCityURL,
  TaleUpdate,
  updateCityDescriptionURL,
  updateCityTravelURL,
  AddCityTaleRequest,
  addCityDescriptionURL,
  addCityTravelURL,
  RemoveCityTaleRequest,
  removeCityDescriptionURL,
  removeCityTravelURL,
  UpdateCityDescriptionRequest,
  UpdateCityTravelRequest
} from '../../../shared/models/api_models/updateCity.model';
import { UserModel } from 'src/app/shared/models/client_models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { AddCityURL, AddCityRequest } from '../../../shared/models/api_models/addCity.model';

@Component({
  selector: 'app-cities-builder',
  templateUrl: './cities-builder.component.html',
  styleUrls: ['./cities-builder.component.scss']
})
export class CitiesBuilderComponent implements OnInit {

  user: UserModel;

  citiesloading = false;
  cities: CityModel[] = [];
  citiesTabs: {
    city?: string;
    tab: string;
    page: number;
    editing?: boolean;
    newTale?: boolean;
  }[] = [];
  newCityTab: {
    newCity?: boolean;
    tab?: string;
  } = { newCity: false, tab: 'desc' };

  cityForm: FormGroup;

  @Output() citySelect: EventEmitter<CityModel> = new EventEmitter<CityModel>();


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
    this.getAllCities();
  }

  // Consultar todas las ciudades
  async getAllCities() {
    this.citiesloading = true;
    this.cd.markForCheck();
    try {
      const req: GetAllCitiesRequest = new GetAllCitiesRequest();
      req.published = null;
      const resp: ResponseModel<GetAllCitiesResponse> = await this.http.post(getAllCitiesURL, req).toPromise();
      if (resp.data.cities) {
        this.cities = resp.data.cities;
        this.citiesTabs = [];
        this.cities.forEach(element => {
          this.citiesTabs.push({ tab: 'desc', page: 0 });
        });
      }

    } catch (err) {
      console.log('*** ERROR ***', err);
    }
    this.citiesloading = false;
    this.cd.markForCheck();

  }

  // desplegar tarjeta de ciudad
  toggleCityInfo(i) {
    this.citiesTabs.forEach((tab, index) => {
      tab.city = (index !== i || tab.city === this.cities[i]._id) ? null : this.cities[i]._id;
    });
    this.newCityTab.newCity = false;
    this.cd.markForCheck();
  }
  // Cambiar la pagina de las descripciones o viajes
  changePage(index, mode) {
    (mode) ? this.citiesTabs[index].page++ : this.citiesTabs[index].page--;
    this.cd.markForCheck();
  }

  // habilitar la redaccion de nueva descripcion o viaje
  newTale(index: number) {
    this.cityForm = this.fb.group({
      tale: [null, [Validators.required]]
    });
    this.citiesTabs[index].editing = true;
    this.citiesTabs[index].newTale = true;
    this.cd.markForCheck();
  }
  // habilitar edicion de descripcion o viaje existente
  editTale(index: number) {
    const tale = (this.citiesTabs[index].tab === 'desc') ?
      this.cities[index].description[this.citiesTabs[index].page].tale :
      this.cities[index].travel[this.citiesTabs[index].page].tale;
    const taleId = (this.citiesTabs[index].tab === 'desc') ?
      this.cities[index].description[this.citiesTabs[index].page]._id :
      this.cities[index].travel[this.citiesTabs[index].page]._id;
    const published = (this.citiesTabs[index].tab === 'desc') ?
      this.cities[index].description[this.citiesTabs[index].page].published :
      this.cities[index].travel[this.citiesTabs[index].page].published;

    this.cityForm = this.fb.group({
      id: [taleId, [Validators.required]],
      tale: [tale, [Validators.required]],
      published: [published, [Validators.required]]
    });
    this.citiesTabs[index].editing = true;
    this.citiesTabs[index].newTale = false;
    this.cd.markForCheck();

  }
  // guardar edicion - nueva historia
  saveCityEdition(index: number, cancel?) {
    if (cancel) {
      this.citiesTabs[index].editing = false;
      this.cd.markForCheck();
      return true;
    }

    if (this.cityForm.valid) {
      if (!this.citiesTabs[index].newTale) {
        // edicion de ...
        this.updateTale(index);
      } else {
        // nuevo ...
        this.addNewTale(index);
      }
      this.citiesTabs[index].editing = false;
      this.cd.markForCheck();
    } else {
      this.cityForm.get('tale').markAsTouched();
    }
  }
  // habilitar publicacion
  publishTale(index) {
    this.cityForm.get('published').setValue(!this.cityForm.get('published').value);
    this.updateTale(index);
  }
  // actualizar descripcion o viaje
  async updateTale(index) {
    this.citiesloading = true;
    this.cd.markForCheck();
    try {
      const data: TaleUpdate = new TaleUpdate();
      data.id = this.cityForm.get('id').value;
      data.tale = this.cityForm.get('tale').value;
      data.published = this.cityForm.get('published').value;

      const req: UpdateCityDescriptionRequest|UpdateCityTravelRequest = (this.citiesTabs[index].tab === 'desc') ?
        { description: data } :
        { travel: data };

      const url = (this.citiesTabs[index].tab === 'desc') ? updateCityDescriptionURL : updateCityTravelURL;
      const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
      this.getAllCities();

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.citiesloading = false;
      this.cd.markForCheck();
    }
  }
  // guardar nueva descripcion o viaje
  async addNewTale(index) {
    this.citiesloading = true;
    this.cd.markForCheck();
    try {
      const req: AddCityTaleRequest = new AddCityTaleRequest();
      req.id = this.cities[index]._id;
      req.tale = this.cityForm.get('tale').value;
      req.author = this.user.username;

      const url = (this.citiesTabs[index].tab === 'desc') ? addCityDescriptionURL : addCityTravelURL;
      const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
      this.getAllCities();

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.citiesloading = false;
      this.cd.markForCheck();
    }
  }
  // eliminar descripcion o viaje
  async deleteTale(index) {
    this.citiesloading = true;
    this.cd.markForCheck();
    try {
      const req: RemoveCityTaleRequest = new RemoveCityTaleRequest();
      req.id = this.cityForm.get('id').value;

      const url = (this.citiesTabs[index].tab === 'desc') ? removeCityDescriptionURL : removeCityTravelURL;
      const resp: ResponseModel<any> = await this.http.post(url, req).toPromise();
      this.getAllCities();

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.citiesloading = false;
      this.cd.markForCheck();
    }
  }


  toggleNewCity() {
    this.citiesTabs.forEach(city => city.city = null);

    this.cityForm = this.fb.group({
      userid: [this.user.username, [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      travel: ['', [Validators.required]]
    });

    this.newCityTab.newCity = !this.newCityTab.newCity;
    this.newCityTab.tab = 'desc';
    this.cd.markForCheck();
  }

  async addNewCity(cancel) {
    if (cancel) {
      this.newCityTab.newCity = false;
      this.cd.markForCheck();
      return null;
    }

    if (this.cityForm.valid) {
      this.citiesloading = true;
      this.newCityTab.newCity = false;
      this.cd.markForCheck();
      try {
        let req: AddCityRequest = new AddCityRequest();
        req = { ... this.cityForm.value };

        const resp: ResponseModel<any> = await this.http.post(AddCityURL, req).toPromise();
        this.getAllCities();

      } catch (err) {
        console.log('*** ERROR ***', err);
        this.citiesloading = false;
        this.cd.markForCheck();
      }
    } else {
      this.cityForm.get('userid').markAsTouched();
      this.cityForm.get('name').markAsTouched();
      this.cityForm.get('description').markAsTouched();
      this.cityForm.get('travel').markAsTouched();
      this.cd.markForCheck();
    }
  }
  // publicar ciudad
  async publishCity(index: number) {
    this.citiesloading = true;
    this.cd.markForCheck();
    try {
      const req: PublishCityRequest = new PublishCityRequest();
      req.published = !this.cities[index].published;
      req.id = this.cities[index]._id;

      const resp: ResponseModel<UpdateResponse> = await this.http.post(publishCityURL, req).toPromise();
      this.getAllCities();

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.citiesloading = false;
      this.cd.markForCheck();
    }
  }



  selectCity(i) {
    this.citySelect.emit(this.cities[i]);
  }



}
