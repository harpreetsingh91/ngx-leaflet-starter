import {ILatLng} from "./latLng.interface";
import {LatLngBounds} from "leaflet";

export class Location implements ILatLng {
    constructor(latitude?: number, longitude?: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    latitude: number;
    longitude: number;
    address: string;
    viewBounds: LatLngBounds;
}
