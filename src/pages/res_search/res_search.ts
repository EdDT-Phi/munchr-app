import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { MoreInfo } from '../info/info';
import { MunchrApi } from '../../providers/munchr-api';

import { Utils } from "../../utils";


@Component({
	selector: 'page-res_search',
	templateUrl: 'res_search.html',
	providers: [ MunchrApi ],
})
export class ResSearch {

	lat: number;
	lng: number;
	restaurants: Array<any>;

	constructor(
		private utils: Utils,
		private munchrApi: MunchrApi,
		private navCtrl: NavController,
	) {

		Geolocation.getCurrentPosition()
		.then( resp => {
			this.lat = resp.coords.latitude;
			this.lng = resp.coords.longitude;
		}).catch((error) => {
			this.utils.display_error_obj('Error getting location: ' + error.message, error);
		});
		
	}

	search_restaurants(event) {
		if (event.target.value == '')  return; 
		this.munchrApi.search_restaurants(this.lat, this.lng, event.target.value)
		.then(data => {
			this.restaurants = data.results;
		})
	}

	view_details(res_id:string) {
		this.navCtrl.push(MoreInfo, { res_id });
	}
}
