import {Component, ViewChild} from "@angular/core";
import {NavigatorComponent} from "../navigator/navigator.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {MapService} from "../../services/map.service";
import {GeocodingService} from "../../services/geocoding.service";
import {Location} from "../../core/location.class";
import {BatMediaElement, SocialFeed} from "../../services/socialFeed.service";
import Marker = L.Marker;
import Popup = L.Popup;

import * as L from 'leaflet';
import 'leaflet-area-select';
import LatLng = L.LatLng;

@Component({
    selector: "app",
    template: require<any>("./app.component.html"),
    styles: [
        require<any>("./app.component.less")
    ],
    providers: [SocialFeed]
})
export class AppComponent {

    @ViewChild(ToolbarComponent) toolbarComponent: ToolbarComponent;

    constructor(private mapService: MapService, private geocoder: GeocodingService, private socialFeed: SocialFeed) {
    }

    ngOnInit() {
        let map = L.map("map", {
            zoomControl: false,
            //center: L.latLng(40.731253, -73.996139), commented out so map doesn't suddenly switch to another location
            zoom: 14,
            minZoom: 4,
            maxZoom: 19,
            layers: [this.mapService.baseMaps.mapbox]
        });

        (map as any).selectArea.enable();

        map.on('areaselected', (e: any) => {
            console.log(e.bounds.toBBoxString()); // lon, lat, lon, lat
            console.log(e.bounds);

            //pass the center of the rectangle and distance to a corner to server.
            //server uses this as center and radius to get tweets (Since twitter works with radius)
            //todo: filter response from server and only consider tweets that fall inside rectangle
            let center: LatLng = e.bounds.getCenter();
            let topLeftVertex: LatLng = e.bounds.getNorthWest();
            let radius: number = center.distanceTo(topLeftVertex)/1000;
            console.log(center);
            console.log(radius);
            this._addMarkers(map, new Location(center.lat, center.lng), radius);
        });

        L.control.zoom({ position: "topright" }).addTo(map);
        L.control.layers(this.mapService.baseMaps).addTo(map);
        L.control.scale().addTo(map);

        this.mapService.map = map;
        let currentLocation;
        this.geocoder.getCurrentLocation()
            .subscribe(
                location => {
                    currentLocation = location;
                    console.log([location.latitude, location.longitude]);
                    map.panTo([location.latitude, location.longitude]);

                    "Don't add markers on initial map load"
                    //this._addMarkers(map, currentLocation);
                },
                err => console.error(err)
            );
        this.toolbarComponent.Initialize();
    }
    //server accepts radius in Kilometers. Pass this function radius in KM
    private _addMarkers(map: any, location: Location, radius: number = 2.0): void {
        if (radius>2.0) radius = 2.0;
        this.socialFeed.getSocialFeed(location, radius).subscribe((feed) => feed.Places.forEach((mediaElement: BatMediaElement) => {
            let location = new Location();
            location.latitude = mediaElement.LatLng[0];
            location.longitude = mediaElement.LatLng[1];
            let marker = this._createMarker(location);
            marker.bindPopup(mediaElement.Text).openPopup();
            marker.addTo(map);
        }));
    }

    private _createMarker(location: Location): Marker {
        return L.marker([location.latitude, location.longitude], {
                icon: L.icon({
                    iconUrl: require<any>("../../../public/images/marker-icon.png"),
                    shadowUrl: require<any>("../../../public/images/marker-shadow.png")
                }),
                draggable: false
            });
    }


}
