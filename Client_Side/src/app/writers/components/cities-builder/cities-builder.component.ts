import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { User, City, ReadFragment, RequestNewCity, RequestPublishCity, NewCityTale } from 'src/client-api';
import { GetAllCities, NewCity, PublishCity, EditCityStory, AddCityStory, DeleteCityStory } from 'src/app/shared/store/locations/locations.actions';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { Subscription } from 'rxjs';
import { isValid } from 'src/app/shared/utils/commons';
import { CityTabs } from 'src/app/shared/constants';
import { TaleEdition } from 'src/client-api';

@Component({
  selector: 'app-cities-builder',
  templateUrl: './cities-builder.component.html',
  styleUrls: ['./cities-builder.component.scss']
})
export class CitiesBuilderComponent implements OnInit, OnDestroy {

  user: User;

  @Select(LocationState.getCities) cities$: Observable<City[]>;
  @Output() citySelect: EventEmitter<City> = new EventEmitter<City>();

  citiesTabs: {
    city?: string;
    loading?: boolean;
    tab: CityTabs;
    page: number;
    editing?: boolean;
    newTale?: boolean;
  };

  newCityTab: {
    loading?: boolean;
    newCity?: boolean;
    tab?: string;
  } = { newCity: false, tab: 'desc' };

  cityForm: FormGroupTyped<NewCityFormData>;

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
  ngOnDestroy() {
    // this.subscription.forEach(subs => subs.unsubscribe());
  }

  // desplegar tarjeta de ciudad
  toggleCityInfo(id) {

    if (this.citiesTabs && id === this.citiesTabs.city) {
      this.citiesTabs = null;
    } else {
      this.citiesTabs = {
        city: id,
        tab: CityTabs.descripcion,
        page: 0,
      };
    }
    this.newCityTab.newCity = false;
    this.cd.markForCheck();
  }
  // Cambiar la pagina de las descripciones o viajes
  changePage(index, mode) {
    (mode) ? this.citiesTabs.page++ : this.citiesTabs.page--;
    this.cd.markForCheck();
  }

  
  // habilitar la redaccion de nueva descripcion o viaje
  newTale() {
    this.cityForm = this.fb.group({
      tale: [[], [Validators.required]]
    });
    this.citiesTabs.editing = true;
    this.citiesTabs.newTale = true;
    this.cd.markForCheck();
  }

  // habilitar edicion de descripcion o viaje existente
  editTale(id: string) {
    const cities = this.store.selectSnapshot(LocationState.getCities);
    const city = cities.find(c => c.id === id);

    const tale = (this.citiesTabs.tab === 'desc') ?
      city.description[this.citiesTabs.page].tale :
      city.travel[this.citiesTabs.page].tale;

    const taleId = (this.citiesTabs.tab === 'desc') ?
      city.description[this.citiesTabs.page].id :
      city.travel[this.citiesTabs.page].id;

    const published = (this.citiesTabs.tab === 'desc') ?
      city.description[this.citiesTabs.page].published :
      city.travel[this.citiesTabs.page].published;

    this.cityForm = this.fb.group({
      id: [taleId, [Validators.required]],
      tale: [tale, [Validators.required]],
      published: [published, [Validators.required]]
    });

    this.citiesTabs.editing = true;
    this.citiesTabs.newTale = false;
    this.cd.markForCheck();

  }
  // guardar edicion - nueva historia
  saveCityEdition(id: string, cancel?) {
    if (cancel) {
      this.citiesTabs.editing = false;
      this.cd.markForCheck();
      return true;
    }

    if (isValid(this.cityForm)) {
      if (!this.citiesTabs.newTale) {
        // edicion de ...
        this.updateTale(id);
      } else {
        // nuevo ...
        this.addNewTale(id);
      }
      this.citiesTabs.editing = false;
      this.cd.markForCheck();
    }
  }

  // habilitar publicacion
  publishTale(cityId) {
    this.cityForm.get('published').setValue(!this.cityForm.get('published').value);
    this.updateTale(cityId);
  }

  // actualizar descripcion o viaje
  async updateTale(cityid) {
    // this.citiesloading = true
    this.citiesTabs.loading = true;
    this.cd.markForCheck();

    const data: TaleEdition = {
      id: this.cityForm.get('id').value,
      tale: this.cityForm.get('tale').value,
      published: this.cityForm.get('published').value,
    };

    await this.store.dispatch(new EditCityStory({
      type: this.citiesTabs.tab,
      cityId: cityid,
      tale: data
    })).toPromise();

    this.citiesTabs.loading = true;
    this.citiesTabs.editing = false;
  }
  // guardar nueva descripcion o viaje
  async addNewTale(id) {

    const req: NewCityTale = {
      cityId: id,
      tale: this.cityForm.get('tale').value,
      author: this.user.username
    };

    await this.store.dispatch(new AddCityStory({ cityId: id, type: this.citiesTabs.tab, tale: req })).toPromise();

    const cities = this.store.selectSnapshot(LocationState.getCities);
    const city: City = cities.find(c => c.id === id);

    this.citiesTabs.editing = false;
    this.citiesTabs.page = (this.citiesTabs.tab === CityTabs.descripcion) ? city.description.length - 1 : city.travel.length - 1;
  }
  // eliminar descripcion o viaje
  async deleteTale(id) {
    // this.citiesloading = true;
    this.cd.markForCheck();

    await this.store.dispatch(new DeleteCityStory({
      cityId: id,
      taleId: this.cityForm.get('id').value,
      type: this.citiesTabs.tab
    })).toPromise();

    this.citiesTabs.editing = false;
    this.citiesTabs.page = 0;

  }



  toggleNewCity() {
    this.citiesTabs = null;

    this.cityForm = this.fb.group({
      userName: [this.user.username, [Validators.required]],
      name: ['', [Validators.required]],
      description: [[], [Validators.required]],
      travel: [[], [Validators.required]]
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

    if (isValid(this.cityForm)) {
      // this.citiesloading = true;
      this.newCityTab.newCity = false;
      this.newCityTab.loading = true;

      this.cd.markForCheck();
      let req: RequestNewCity = {};
      req = {
        ... this.cityForm.value,
      };
      await this.store.dispatch(new NewCity(req)).toPromise();
      this.newCityTab.loading = false;

    }
  }


  // publicar ciudad
  async publishCity(id: string, published: boolean) {
    // this.citiesloading = true;
    const req: RequestPublishCity = {
      id,
      published,
    };

    await this.store.dispatch(new PublishCity(req)).toPromise();
  }

  selectCity(id) {
    const cities = this.store.selectSnapshot(LocationState.getCities);
    const city: City = cities.find(c => c.id === id);

    this.citySelect.emit(city);
  }

}

class NewCityFormData {
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

