import { Component } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';

import { Main } from '../main/main';

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
	) {
		this.restaurant = this.navParams.get('restaurant');
		this.map = `https://maps.googleapis.com/maps/api/staticmap
		?size=500x300
		&markers=${this.navParams.get('lat')},${this.navParams.get('lat')}
		&key=AIzaSyC5D3VgliMud60vD_BSasm_9Ru2qOAzJ_s`
	}

	done() {
		this.navCtrl.setRoot(Main)
	}
}
