import { PresentationComponent } from 'src/app/users-login/containers/presentation/presentation.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { WritersComponent } from './writers.component';
import { WritersHomeComponent } from './components/writers-home/writers-home.component';
import { WorldStoriesComponent } from 'src/app/writers/containers/world-stories/world-stories.component';

const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: ''
    // },
    {
        path: '',
        component: WritersComponent,
        children: [
            {
                path: '',
                component: WritersHomeComponent
            }, {
                path: 'world',
                component: WorldStoriesComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WritersRoutingModule { }
