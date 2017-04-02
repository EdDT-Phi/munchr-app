import { Component } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions, NativeStorage } from 'ionic-native';
import { SocialSharing } from 'ionic-native';

import { MunchrApi } from '../../providers/munchr-api';

import { Main } from '../main/main';
import { Utils } from '../../utils';

@Component({
	selector: 'page-final',
	templateUrl: 'final.html',
	providers: [ MunchrApi ]
})


export class Final {

	restaurant: any;
	map: string;

	constructor(
		public navParams: NavParams,
		public navCtrl: NavController, 
		public utils: Utils, 
	) {
		this.restaurant = this.navParams.get('restaurant');
		if (!this.restaurant.photo) {
			this.restaurant.photo = this.restaurant.photos[0];
		}
		this.map = `https://maps.googleapis.com/maps/api/staticmap
		?size=500x300
		&markers=${this.restaurant.location.lat},${this.restaurant.location.lon}
		&key=AIzaSyCdSzocNEuxd52QRK9bjWcJvpgBPRWqc9w`

		NativeStorage.setItem('last_restaurant', this.restaurant)
		.then( success => {}, error => {
			this.utils.display_error(error);
		});

		this.change_time();
	}

	navigate() {
		let options: LaunchNavigatorOptions = {}

		LaunchNavigator.navigate([this.restaurant.location.lat, this.restaurant.location.lon], options)
		.then (
			success => console.log('Yay! ', success),
			error => this.utils.display_error(error)
		);
	}

	done() {
		this.navCtrl.setRoot(Main)
	}

	share() {
		SocialSharing.shareWithOptions({
			message: 'Come eat at this place!',
			subject: 'Munchr: going out to eat',
			url: `https://munchr-test.herokuapp.com/restaurant/${this.restaurant.id}`
		}).then(success => {}, error => {
			this.utils.display_error(error);
		});
	}

	change_time() {
		NativeStorage.setItem('last_time', Math.floor(Date.now() / (1000 * 60)))
		.then( success => {}, error => {
			this.utils.display_error(error);
		});
	}
}
