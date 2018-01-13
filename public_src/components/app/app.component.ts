import {ChangeDetectorRef, Component, NgZone, ViewChild} from "@angular/core";
import {MapService} from "../../services/map.service";
import {GeocodingService} from "../../services/geocodingService.service";
import {Location} from "../../core/location.class";
import {BatMediaElement, SocialFeed} from "../../services/socialFeed.service";
import Marker = L.Marker;
import Popup = L.Popup;

import * as L from 'leaflet';
import 'leaflet-area-select';
import LatLng = L.LatLng;
import * as Autolinker from 'autolinker';
import {Map} from "leaflet";
import {introJs} from "intro.js";
import 'leaflet-spin';

@Component({
    selector: "app",
    template: require<any>("./app.component.html"),
    styles: [
        require<any>("./app.component.less")
    ],
    providers: [SocialFeed]
})
export class AppComponent {
    get sentimentFilter(): string {
        return this._sentimentFilter;
    }

    get keywordFilter(): string {
        return this._keywordFilter;
    }

    get mediaElements(): Array<BatMediaElement> {
        return this._mediaElements;
    }

    get markerClicked(): boolean {
        return this._markerClicked;
    }

    get sentimentOptions(): Array<String> {
        return this._sentimentOptions;
    }

    //@ViewChild(ToolbarComponent) toolbarComponent: ToolbarComponent;

    constructor(private mapService: MapService,
                private geocoder: GeocodingService,
                private socialFeed: SocialFeed,
                private ngZone: NgZone) {
    }

    private _markerClicked: boolean = false;

    private _mediaElements: Array<BatMediaElement> = [];

    private _sentimentOptions: Array<string> = ["Positive", "Neutral", "Negative"];

    private _sentimentFilter: string = "";

    private _keywordFilter: string = "";

    private _allMarkers: Array<Marker> = [];

    ngOnInit() {

        this._runIntroJs();

        let map = L.map("map", {
            zoomControl: false,
            zoom: 14,
            minZoom: 4,
            maxZoom: 19,
            layers: [this.mapService.baseMaps.mapbox]
        });
        (map as any).selectArea.enable();

        map.on('areaselected', (e: any) => {
            //start spinner
            (map as any).spin(true);

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

            //remove markers and clear current markers array
            this.removeOldMarkers(this._allMarkers, map);
            this._allMarkers = [];
            this._mediaElements = [];

            //this is needed because template subscribes to a different stream without ngZone
            this.ngZone.run(
                () => {
                    this._addMarkers(map, new Location(center.lat, center.lng), radius);
                });
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

                    "Don't add mediaElements on initial map load"
                    //this._addMarkers(map, currentLocation);
                },
                err => console.error(err)
            );
    }
    //server accepts radius in Kilometers. Pass this function radius in KM
    private _addMarkers(map: any, location: Location, radius: number = 2.0): void {
        if (radius>2.0) radius = 2.0;
        this.socialFeed.getSocialFeed(location, radius).subscribe((feed) => feed.Places.forEach((mediaElement: BatMediaElement) => {
            let location = new Location();
            location.latitude = mediaElement.LatLng[0];
            location.longitude = mediaElement.LatLng[1];
            let marker = this._createMarker(location);
            let linkedMediaText: string = Autolinker.link(mediaElement.Text);
            mediaElement.Text = linkedMediaText;

            //add markers to current markers array
            this._allMarkers.push(marker);

            marker.bindPopup(linkedMediaText).openPopup();
            marker.on('click', () => this._markerClicked = true);
            marker.addTo(map);
            this._mediaElements.push(mediaElement);

            //remove spinner
            (map as any).spin(false);
        }));
    }

    private _createMarker(location: Location): Marker {
        return L.marker([location.latitude, location.longitude], {
                icon: L.icon({
                    iconUrl: require<any>("../../../docs/images/marker-icon.png"),
                    shadowUrl: require<any>("../../../docs/images/marker-shadow.png")
                }),
                draggable: false
            });
    }

    public filterMediaBySentimentAndKeyword(sentiment: string, keywordFilter: string, mediaElement: BatMediaElement): boolean{
        return (mediaElement.Sentiment == sentiment || sentiment == "") && mediaElement.Text.toUpperCase().includes(keywordFilter.toUpperCase());
    }

    public clearFilters(): void {
        this._keywordFilter = "";
        this._sentimentFilter = "";
    }

    private removeOldMarkers(markers: Array<Marker>, map: Map): void {
        markers.forEach(
            (marker: Marker) => {
                map.removeLayer(marker);
            }
        );
    }

    private _runIntroJs(): void {
    let intro = introJs();
    // Initialize steps
    intro.setOptions({
                         steps: [
                             {
                                 element: '#search',
                                 intro: "Enter location you want to search for here",
                                 position: 'right'
                             },
                             {
                                 element: '#map',
                                 intro: "Hold down 'control' button on keyboard and using mouse select the area you want to view media feeds for <IMG SRC='https://media.giphy.com/media/3ov9jKxRXoCGNpt0B2/giphy.gif'>",
                                 position: 'left'
                             },
                             {
                                 element: "#search-keyword",
                                 intro: 'To search for a keyword among media feeds enter keyword here.',
                                 position: 'right'
                             },
                             {
                                 element: '#sentiment',
                                 intro: " To filter feeds by sentiment use this dropdown",
                                 position: 'right'
                             }
                         ]
                     });

    // Start tutorial
    intro.start();
    }
}
