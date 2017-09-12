import {Injectable} from "@angular/core";
import {Http, RequestOptions, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {ILatLng} from "../core/latLng.interface";

@Injectable()
export class SocialFeed {
    constructor (private http: Http) {}

    private _twitterFeedURL = 'http://bat-server.herokuapp.com/twitterFeed';

    public getSocialFeed(location: ILatLng, radius:number): Observable<TwitterFeed> {
        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set('lat', location.latitude.toString());
        queryParams.set('lng', location.longitude.toString());
        queryParams.set('radius', radius.toString());

        let requestOptions = new RequestOptions();
        requestOptions.params = queryParams;

        return this.http.get(this._twitterFeedURL, requestOptions).map(res => res.json())
    }

    // public get getSocialFeed(): Array<Array<number>> {
    //     //let a: string = "{(49.24738244,-123.10108315), (49.25,-123.11), (49.25,-123.11), (49.25,-123.11), (49.2540975,-123.1149591), (49.25,-123.11), (49.25,-123.11), (49.25,-123.11), (49.2547188,-123.106102), (49.25,-123.11), (49.25,-123.11), (49.2485,-123.1088), (49.25,-123.11), (49.25,-123.11), (49.25,-123.11)}";
    //     let a: string = '{"Places" : [[48.44799549, -123.42760996], [48.44799926, -123.42763494], [48.44586589, -123.42059163], [48.45191844, -123.41721786]]}';
    //     return JSON.parse(a).Places;
    // }
}

interface TwitterFeed {
    Places: Array<BatMediaElement>
}

export interface BatMediaElement {
    LatLng: Array<number>,
    Text: string,
    UserName: string,
    UserProfilePictureURL: string,
    UserLocation: string
    Sentiment: string
}