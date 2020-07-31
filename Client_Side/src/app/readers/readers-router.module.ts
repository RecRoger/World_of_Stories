import { PresentationComponent } from 'src/app/users-login/containers/presentation/presentation.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReadersComponent } from './readers.component';
import { ReadersHomeComponent } from './componentes/readers-home/readers-home.component';
import { SelectCityComponent } from './componentes/select-city/select-city.component';
import { ReadCityComponent } from './componentes/read-city/read-city.component';
import { ReadPlaceComponent } from './componentes/read-place/read-place.component';

const routes: Routes = [
    {
        path: '',
        component: ReadersComponent,
        children: [
            {
                path: '',
                component: ReadersHomeComponent
            },
            {
                path: 'select',
                component: SelectCityComponent
            },
            {
                path: 'city',
                component: ReadCityComponent

            },
            {
                path: 'place',
                component: ReadPlaceComponent

            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReadersRoutingModule { }
