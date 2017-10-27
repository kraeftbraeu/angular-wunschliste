import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login.component';
import { WishesComponent } from './components/wishes.component';
import { PresentsComponent } from './components/presents.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'wishes', component: WishesComponent, canActivate: [AuthGuard] },
    { path: 'presents', component: PresentsComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);