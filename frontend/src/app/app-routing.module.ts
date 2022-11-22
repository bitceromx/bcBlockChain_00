import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '',   redirectTo: '/', pathMatch: 'full' },
  { path: 'routing.module.ts', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) },
  { path: 'routing.module.ts', loadChildren: () => import('./org1/org1.module').then(m => m.Org1Module) },
  { path: 'routing.module.ts', loadChildren: () => import('./org2/org2.module').then(m => m.Org2Module) },
  { path: 'routing.module.ts', loadChildren: () => import('./public-state/public-state.module').then(m => m.PublicStateModule) },
  { path: 'routing.module.ts', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
