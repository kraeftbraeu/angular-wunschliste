import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives/alert.component';
import { AuthGuard } from './_guards/auth.guard';
import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { StorageHandler } from './services/localstorage.service';
import { RestService } from './services/rest.service';
import { JwtService } from './services/jwt.service';
import { LoginComponent } from './components/login.component';
import { HomeComponent } from './components/home.component';
import { WishesComponent } from './components/wishes.component';
import { PresentsComponent } from './components/presents.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        WishesComponent,
        PresentsComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthService,
        JwtService,
        RestService,
        StorageHandler
    ],
    bootstrap: [AppComponent]
})
export class AppModule
{}