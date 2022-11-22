import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { OnboardingComponent } from './onboarding/onboarding.component';
import { StepperComponent } from './stepper/stepper.component';
import { AccountComponent } from './steps/account/account.component';
import { DataComponent } from './steps/data/data.component';
import { FinishComponent } from './steps/finish/finish.component';
import { StartComponent } from './steps/start/start.component';
import { OtpComponent } from './steps/otp/otp.component';
import { VideoIdComponent } from './eId/video-id/video-id.component';
import { InfoComponent } from './eId/info/info.component';
import { ClientNotFoundComponent } from './steps/client-not-found/client-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
  },
  { path: 'onboarding', component: OnboardingComponent,},
  {
    path: 'onboarding/documentation',
    component: StepperComponent,
    children: [
      { path: 'start', component: StartComponent},
      { path: 'data', component: DataComponent},
      { path: 'account', component: AccountComponent},
      { path: 'otp', component: OtpComponent},
      { path: 'finish', component: FinishComponent},
      { path: 'videoselfie', component: ClientNotFoundComponent },
      { path: 'video-id', component: VideoIdComponent },
      { path: 'video-info', component: InfoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
