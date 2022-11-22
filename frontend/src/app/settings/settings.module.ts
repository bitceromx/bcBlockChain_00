import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { AnzenComponentsModule } from 'anzen-components';
import { ComponentModule } from './../component.module';

import{ AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    AnzenComponentsModule,
    ComponentModule
  ]
})
export class SettingsModule { }
