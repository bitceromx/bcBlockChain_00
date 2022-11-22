import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// modules
import { ClientModule } from './client/client.module';
import { Org1Module } from './org1/org1.module';
import { Org2Module } from './org2/org2.module';
import { PublicStateModule } from './public-state/public-state.module';
import { StepperComponent } from './client/stepper/stepper.component';

import { ComponentModule } from './component.module';
import { SettingsModule } from './settings/settings.module';

@NgModule({
  declarations: [
    AppComponent,
    StepperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClientModule,
    Org1Module,
    Org2Module,
    PublicStateModule,
    ComponentModule,
    SettingsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
 