import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Org2RoutingModule } from './org2-routing.module';
import { AnzenComponentsModule } from 'anzen-components';
import { ComponentModule } from './../component.module';

import { ClientListComponent } from './client-list/client-list.component';


@NgModule({
  declarations: [ClientListComponent],
  imports: [
    CommonModule,
    Org2RoutingModule,
    AnzenComponentsModule,
    ComponentModule
  ]
})
export class Org2Module { }
