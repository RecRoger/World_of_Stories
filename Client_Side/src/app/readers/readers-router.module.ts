import { PresentationComponent } from 'src/app/users-login/containers/presentation/presentation.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReadersComponent } from './readers.component';

const routes: Routes = [
    {
        path: '',
        component: ReadersComponent
        // children: [
        //     {
        //         path: '',
        //         component: WritersHomeComponent
        //     }, {
        //         path: 'world',
        //         component: WorldStoriesComponent
        //     }
        // ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReadersRoutingModule { }
