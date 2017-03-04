import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';

import { Utils } from "../../utils";

@Component({
	selector: 'page-info',
	templateUrl: 'info.html',
	providers: [ MunchrApi ]
})


export class MoreInfo {

	restaurant: any;
	reviews: Array<any>;
	photos: Array<string>;
	
	constructor(
		public munchrApi: MunchrApi, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public utils: Utils,
	) {
		this.restaurant = this.navParams.get('restaurant');
		console.log(this.restaurant);
		this.reviews = [{
			rating: 3.5,
			review_text: 'This is definitely a place that has food',
			review_time_friendly: '10 centuries ago'
		}];
		this.photos = [];

		this.munchrApi.reviews(this.restaurant.id)
		.then( data => {
			if (data.error) {
				this.utils.display_error(data.error);
			} else {
				this.reviews = data.results;
			}
		});

		this.munchrApi.photos(this.restaurant)
		.then( data => {
			if (data.error) {
				this.utils.display_error(data.error);
			} else {
				this.photos = data.results;
			}
		});
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}
}
