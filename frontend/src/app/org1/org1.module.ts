import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Org1RoutingModule } from './org1-routing.module';
import { AnzenComponentsModule } from 'anzen-components';
import { ComponentModule } from './../component.module';
//components
import { AssetsOrg1Component } from './assets-org1/assets-org1.component';
import { ClientListComponent } from './client-list/client-list.component';



@NgModule({
  declarations: [AssetsOrg1Component, ClientListComponent],
  imports: [
    CommonModule,
    Org1RoutingModule,
    AnzenComponentsModule,
    ComponentModule
  ]
})
export class Org1Module { }
