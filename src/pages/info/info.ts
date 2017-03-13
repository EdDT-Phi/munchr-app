import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions, NativeStorage } from 'ionic-native';

import { MunchrApi } from '../../providers/munchr-api';

import { Utils } from "../../utils";

@Component({
	selector: 'page-info',
	templateUrl: 'info.html',
	providers: [ MunchrApi ]
})


export class MoreInfo {

	restaurant: any;
	map: string;
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

		this.map = `https://maps.googleapis.com/maps/api/staticmap
		?size=500x300
		&markers=${this.restaurant.location.lat},${this.restaurant.location.lon}
		&key=AIzaSyCdSzocNEuxd52QRK9bjWcJvpgBPRWqc9w`
	}

	// navigate() {
	// 	let options: LaunchNavigatorOptions = {}

	// 	LaunchNavigator.navigate([this.restaurant.location.lat, this.restaurant.location.lon], options)
	// 	.then (
	// 		success => console.log('Yay! ', success),
	// 		error => this.utils.display_error(error)
	// 	);
	// }

	dismiss() {
		this.viewCtrl.dismiss();
	}

	choose() {
		this.viewCtrl.dismiss(true);
	}
}
