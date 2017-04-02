import { Component } from '@angular/core';

import { NavParams, ViewController, LoadingController, Loading } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';

import { Utils } from "../../utils";

@Component({
	selector: 'page-info',
	templateUrl: 'info.html',
	providers: [ MunchrApi ]
})


export class MoreInfo {

	// restaurant: any;
	loading: Loading = null;
	map: string;
	details: {
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
	};
	
	constructor(
		private utils: Utils,
		private munchrApi: MunchrApi, 
		private navParams: NavParams,
		private loadingCtrl: LoadingController,
		private viewCtrl: ViewController,
	) {

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();

		this.munchrApi.details(this.navParams.get('res_id'))
		.then( data => {
			console.log(data);
			this.loading.dismiss();
			this.loading = null;

			this.details = data.result;
			this.map = `https://maps.googleapis.com/maps/api/staticmap
			?size=500x300
			&markers=${this.details.location.lat},${this.details.location.lon}
			&key=AIzaSyCdSzocNEuxd52QRK9bjWcJvpgBPRWqc9w`
		}, error => {this.utils.display_error(error);});
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	choose() {
		this.viewCtrl.dismiss(this.details);
	}
}
