/**
 * Created by harpreetsingh on 2017-06-23.
 */
import { Component, Input } from '@angular/core';
import {BatMediaElement} from "../../services/socialFeed.service";

@Component({
    selector: 'sidebar-media-content-card',
    template: require<any>("./sidebarMediaContentCard.component.html"),
})
export class SideBarMediaContent {
    @Input() mediaElement: BatMediaElement;
    constructor() {}
}