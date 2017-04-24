// import { Component } from '@angular/core';

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

	restaurant: {
		res_id: string,
		name: string,
		phone: string,
		website: string,
		price:number,
		opennow: boolean,
		reviews: Array<any>,
		photos: Array<any>,
		rating: number,
		location: {
			lat: number,
			lon: number,
		},
		starred: boolean,
		photo: string,
	};
	map: string;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};

	constructor(
		public utils: Utils, 
		public munchrApi: MunchrApi,
		public navParams: NavParams,
		public navCtrl: NavController, 
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
		.then( success => {}, error => {});

		NativeStorage.getItem('user')
		.then(user => {
			this.user = user;
		}, error => {
			// this.user = {user_id: 3, first_name:'Tyler', last_name:'Camp', photo_url:''}
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
			url: `https://munchr-test.herokuapp.com/restaurant/${this.restaurant.res_id}`
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

	star_res() {
		if (!this.restaurant.starred) {
			this.munchrApi.star_res(this.user.user_id, this.restaurant.res_id)
			.then(() => {
				this.restaurant.starred = true;
			}, error => {});
		} else {
			this.munchrApi.unstar_res(this.user.user_id, this.restaurant.res_id)
			.then(() => {
				this.restaurant.starred = false;
			}, error => {});
		}
	}
}
