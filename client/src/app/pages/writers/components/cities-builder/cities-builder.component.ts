import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { LoaderComponent } from '@components/loader/loader.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { City, Readable, User } from '@core/api';
import { MaterialFormsModules } from '@core/material-modules';
import { CityTabs } from '@core/models/constants';
import { AuthService } from '@core/services/auth.service';
import { LocationsService } from '@core/services/locations.service';
import { finalize, Observable } from 'rxjs';
import { AnimatedFragmentComponent } from '@components/animated-fragment/animated-fragment.component';

interface NewCityFormData {
  // para nuevos relatos de ciudades existentes
  id?: string;
  tale?: Readable[];
  published?: boolean;

  // para las nuevas ciudades
  userName?: string;
  name?: string;
  description?: Readable[];
  travel?: Readable[];
}

@Component({
  selector: 'app-cities-builder',
  templateUrl: './cities-builder.component.html',
  styleUrls: ['./cities-builder.component.scss'],
  imports: [
    AsyncPipe,
    NgClass,
    DatePipe,
    LoaderComponent,
    ...MaterialFormsModules,
    MatTooltipModule,
    AnimatedFragmentComponent
  ]
})
export class CitiesBuilderComponent {
  @Output() citySelect: EventEmitter<string> = new EventEmitter<string>();

  protected readonly locationsService = inject(LocationsService)

  protected readonly fb = inject(FormBuilder)

  public cities$: Observable<City[]> = this.locationsService.cities$;

  public cityForm: FormGroup = this.fb.group({});

  public user: User | null = inject(AuthService).userSnaphot;

  public cityTabs = CityTabs

  public citiesTabs: {
    city?: string;
    loading?: boolean;
    tab?: CityTabs;
    page?: number;
    editing?: boolean;
    newTale?: boolean;
  } = {};

  newCityTab: {
    loading?: boolean;
    newCity?: boolean;
    tab?: string;
  } = { newCity: false, tab: 'desc' };


  // desplegar tarjeta de ciudad
  toggleCityInfo(id: string) {
    if (this.citiesTabs && id === this.citiesTabs.city) {
      this.citiesTabs = {};
    } else {
      this.citiesTabs = {
        city: id,
        loading: true,
        tab: CityTabs.descripcion,
        page: 0,
      };

      this.locationsService.getCity(id)
        .pipe(finalize(
          () => { this.citiesTabs!.loading = false }
        ))
        .subscribe(_ => {
          console.log(_)
          this.citiesTabs!.loading = false
          this.newCityTab.newCity = false;
        })
    }
  }

  // Cambiar la pagina de las descripciones o viajes
  public changePage(mode: boolean): void {
    (mode) ? this.citiesTabs.page!++ : this.citiesTabs.page!--;
  }


  // habilitar la redaccion de nueva descripcion o viaje
  public newTale(): void {
    this.cityForm = this.fb.group({
      tale: [[], [Validators.required]]
    });
    this.citiesTabs.editing = true;
    this.citiesTabs.newTale = true;
  }

  // // habilitar edicion de descripcion o viaje existente
  public editTale(id: string): void {
    const city = this.locationsService.getCitySnapshot(id);

    if (city) {
      const page = this.citiesTabs.page || 0
      const tale = (this.citiesTabs.tab === CityTabs.descripcion) ?
        city.description![page].tale :
        city.travel![page].tale;

      const taleId = (this.citiesTabs.tab === CityTabs.descripcion) ?
        city.description![page].id :
        city.travel![page].id;

      const published = (this.citiesTabs.tab === CityTabs.descripcion) ?
        city.description![page].published :
        city.travel![page].published;
      this.cityForm = this.fb.group({
        id: [taleId, [Validators.required]],
        tale: [tale, [Validators.required]],
        published: [published, [Validators.required]]
      });

      this.citiesTabs.editing = true;
      this.citiesTabs.newTale = false;
    }
  }
  // // guardar edicion - nueva historia
  // saveCityEdition(id: string, cancel?) {
  //   if (cancel) {
  //     this.citiesTabs.editing = false;
  //     this.cd.markForCheck();
  //     return true;
  //   }

  //   if (isValid(this.cityForm)) {
  //     if (!this.citiesTabs.newTale) {
  //       // edicion de ...
  //       this.updateTale(id);
  //     } else {
  //       // nuevo ...
  //       this.addNewTale(id);
  //     }
  //     this.citiesTabs.editing = false;
  //     this.cd.markForCheck();
  //   }
  // }

  /*   // habilitar publicacion
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
  
      this.citiesTabs.loading = false;
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
  
    } */


  /*  toggleNewCity() {
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
     this.citySelect.emit(id);
   } */

}

