import {Component, ViewChild} from "@angular/core";
import {NavigatorComponent} from "../navigator/navigator.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {MapService} from "../../services/map.service";
import {GeocodingService} from "../../services/geocoding.service";
import {Location} from "../../core/location.class";
import {BatMediaElement, SocialFeed} from "../../services/socialFeed.service";
import Marker = L.Marker;
import Popup = L.Popup;

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
            zoom: 12,
            minZoom: 4,
            maxZoom: 19,
            layers: [this.mapService.baseMaps.mapbox]
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
                    this._addMarkers(map, currentLocation);
                },
                err => console.error(err)
            );
        this.toolbarComponent.Initialize();
        map.on('moveend', () => {
            let location = new Location();
            location.latitude = map.getCenter().lat;
            location.longitude = map.getCenter().lng;
            this._addMarkers(map, location);
        });
    }

    private _addMarkers(map: any, location: Location): void {
        this.socialFeed.getSocialFeed(location).subscribe((feed) => feed.Places.forEach((mediaElement: BatMediaElement) => {
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
