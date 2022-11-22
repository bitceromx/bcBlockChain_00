import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { AssetsOrg1Component } from './assets-org1/assets-org1.component';
import { ClientListComponent } from './client-list/client-list.component';

const routes: Routes = [
  { path: 'assets-org1', component: AssetsOrg1Component },
  { path: 'org1-clients-list', component: ClientListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Org1RoutingModule { }
