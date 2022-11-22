import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { StartComponent } from './steps/start/start.component';
import { DataComponent } from './steps/data/data.component';
import { AccountComponent } from './steps/account/account.component';
import { FinishComponent } from './steps/finish/finish.component';
import { AnzenComponentsModule } from 'anzen-components';
import { OtpComponent } from './steps/otp/otp.component';

import { ComponentModule } from './../component.module';
import { VideoIdComponent } from './eId/video-id/video-id.component';
import { InfoComponent } from './eId/info/info.component';
import { ClientNotFoundComponent } from './steps/client-not-found/client-not-found.component';


@NgModule({
  declarations: [
    OnboardingComponent,
    StartComponent,
    DataComponent,
    AccountComponent,
    FinishComponent,
    OtpComponent,
    VideoIdComponent,
    InfoComponent,
    ClientNotFoundComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    AnzenComponentsModule,
    ReactiveFormsModule,
    ComponentModule,
    AnzenComponentsModule
  ]
})
export class ClientModule { }
