import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";

import {HomeListComponent} from './home-list/home-list.component';
import {DistancePipe} from './distance.pipe';
import {FrameworkComponent} from './framework/framework.component';
import {AboutComponent} from './about/about.component';
import {HomepageComponent} from './homepage/homepage.component';

@NgModule({
  declarations: [
    HomeListComponent,
    DistancePipe,
    FrameworkComponent,
    AboutComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomepageComponent
      },
      {
        path: 'about',
        component: AboutComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [FrameworkComponent]
})
export class AppModule {
}
