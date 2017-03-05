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
	details: any = {};
	
	constructor(
		public munchrApi: MunchrApi, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public utils: Utils,
	) {
		this.restaurant = this.navParams.get('restaurant');
		console.log(this.restaurant);
		this.details.reviews = [{
			rating: 3.5,
			review_text: 'This is definitely a place that has food',
			review_time_friendly: '10 centuries ago'
		}];
		this.details.photos = [];

		this.munchrApi.details(this.restaurant.id)
		.then( data => {
			console.log(data);
			if (data.error) {
				this.utils.display_error(data.error);
			} else {
				this.details = data.results;
				console.log(this.details);
			}
		});
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	choose() {
		this.viewCtrl.dismiss(true);
	}
}
