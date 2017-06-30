import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MoreInfo } from '../info/info';
import { MunchrApi } from '../../providers/munchr-api';
import { LocationProvider } from '../../providers/location';

import { Utils } from "../../utils";


@Component({
	selector: 'page-res_search',
	templateUrl: 'res_search.html',
})
export class ResSearch {

	location:{
		lat: number,
		lng: number,
	};
	restaurants: Array<any>;

	constructor(
		private utils: Utils,
		private munchrApi: MunchrApi,
		private locationProvider: LocationProvider,
		private navCtrl: NavController,
	) {
		this.location = locationProvider.get_user_position();
	}

	search_restaurants(event) {
		if (event.target.value == '')  return;
		this.munchrApi.search_restaurants(this.location.lat, this.location.lng, event.target.value)
		.then(data => {
			this.restaurants = data.results;
		});
	}

	view_details(res_id:string) {
		this.navCtrl.push(MoreInfo, { res_id });
	}
}
