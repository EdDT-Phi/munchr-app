import { Component } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';
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
		this.map = `https://maps.googleapis.com/maps/api/staticmap
		?size=500x300
		&markers=${this.restaurant.location.lat},${this.restaurant.location.lon}
		&key=AIzaSyC5D3VgliMud60vD_BSasm_9Ru2qOAzJ_s`

		console.log(this.map);
		console.log(this.restaurant);
	}

	done() {
		this.navCtrl.setRoot(Main)
	}

	share() {
		SocialSharing.shareWithOptions({
			message: 'Come eat at this place!',
			subject: 'Munchr: going out to eat',
			url: `https://munchr-test.herokuapp.com/restaurant/${this.restaurant.id}`
		}).then(()=> {

		}, (error) => {
			this.utils.display_error(error);
		});
	}
}
