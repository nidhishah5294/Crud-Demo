import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuardService } from './helper/auth.guard.service';
import { HomeComponent } from './home/home.component';

const userModule = () => import('./user/user.module').then(x => x.UserModule);
const accountModule = () => import('./account/account.module').then(X => X.AccountModule);

const routes: Routes = [
  // { path: '', component: AppComponent, canActivate: [AuthGuardService] },
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'users', loadChildren: userModule, canActivate: [AuthGuardService] },
  { path: 'account', loadChildren: accountModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
