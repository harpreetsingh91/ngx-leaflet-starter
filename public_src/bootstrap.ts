/// <reference path="./typings/require.d.ts"/>
/// <reference path="./typings/leaflet.vectorgrid.d.ts"/>

import "leaflet";
import "leaflet.vectorgrid";
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";
import "reflect-metadata";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "leaflet/dist/leaflet.css";

import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {HttpModule} from "@angular/http";
import {NgModule} from "@angular/core";
import {FormsModule}   from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

import {AppComponent} from "./components/app/app.component";
import {NavigatorComponent} from "./components/navigator/navigator.component";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";

import {MapService} from "./services/map.service";
import {GeocodingService} from "./services/geocodingService.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MdButtonModule, MdCardModule, MdInputModule, MdSelectModule, MdTooltipModule} from "@angular/material";

import 'hammerjs'
import {FlexLayoutModule} from "@angular/flex-layout";
import {MdToolbarModule} from '@angular/material';
import {SideBarMediaContent} from "./components/sidebarMediaContent/sidebarMediaContentCard.component";

@NgModule({
    imports: [HttpModule, FormsModule, BrowserModule, BrowserAnimationsModule,
        FlexLayoutModule,
        MdInputModule,
        MdCardModule,
        MdToolbarModule,
        MdSelectModule,
        MdButtonModule,
        MdTooltipModule],
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        NavigatorComponent,
        ToolbarComponent,
        SideBarMediaContent
    ],
    providers: [
        MapService,
        GeocodingService
    ]
})

export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
