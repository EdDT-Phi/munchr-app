import { Component } from '@angular/core';
import { NativeStorage } from 'ionic-native';
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
	};
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
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

		NativeStorage.getItem('user')
		.then(user => {
			this.user = user;
			this.get_details(this.navParams.get('res_id'));
		}, error => {
			this.user = {user_id: 3, first_name:'Tyler', last_name:'Camp', photo_url:''}
			this.get_details(this.navParams.get('res_id'));
		});
	}

	get_details(res_id:string) {
		this.munchrApi.details(this.user.user_id, res_id)
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

	star_res() {
		if (!this.details.starred) {
			this.munchrApi.star_res(this.user.user_id, this.details.res_id)
			.then(() => {
				this.details.starred = true;
			}, error => {});
		} else {
			this.munchrApi.unstar_res(this.user.user_id, this.details.res_id)
			.then(() => {
				this.details.starred = false;
			}, error => {});
		}
	}
}
