import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AnzenComponentsModule } from 'anzen-components';

//components
import { MenuComponent } from './components/menu/menu.component';
import { ImageCardComponent } from './components/card-image/card-image.component';

// modules
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    MenuComponent,
    ImageCardComponent
  ],
  imports: [
    BrowserModule,
    AnzenComponentsModule,
    HttpClientModule
  ],
  exports: [MenuComponent, ImageCardComponent, HttpClientModule],
  providers: [],
  bootstrap: [ComponentModule]
})
export class ComponentModule { }
