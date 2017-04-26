import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { NavParams, ViewController, LoadingController, Loading, NavController } from 'ionic-angular';

import { Final } from '../final/final';
import { MunchrApi } from '../../providers/munchr-api';
import { UserService } from '../../providers/user-service';

import { Utils } from "../../utils";

@Component({
	selector: 'page-info',
	templateUrl: 'info.html',
	providers: [ MunchrApi, UserService ]
})
export class MoreInfo {

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
		photo_url: string,
	};
	location: {
		lat: number,
		lon: number,
	};
	
	constructor(
		private utils: Utils,
		private munchrApi: MunchrApi, 
		private navParams: NavParams,
		private navCtrl: NavController,
		private viewCtrl: ViewController,
		private loadingCtrl: LoadingController,
		private userService: UserService,
	) {

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();


		this.userService.get_user()
		.then(user => {
			this.user = user;
			this.get_details(this.navParams.get('res_id'));
		}, error => { });
	}

	get_price() {
		if (this.details.price >= 1)
			return ' - ' + Array(this.details.price).join('$');
		return '';
	}

	get_details(res_id:string) {
		Geolocation.getCurrentPosition()
		.then( resp => {
			this.api_request(res_id, resp.coords.latitude, resp.coords.longitude);
		}).catch((error) => {
			this.utils.display_error_obj('Error getting location: ' + error.message, error);
		});
		
	}

	api_request(res_id:string, lat:number, lon:number) {
		this.location = {lat, lon};
		this.munchrApi.details(this.user.user_id, res_id)
		.then( data => {
			console.log(data);
			this.loading.dismiss();
			this.loading = null;

			this.details = data.result;
			this.map = `https://maps.googleapis.com/maps/api/staticmap
			?size=500x300
			&markers=color:0xff4e00%7clabel:R%7C${this.details.location.lat},${this.details.location.lon}
			&markers=color:blue%7Clabel:Y%7C${lat},${lon}
			&key=AIzaSyCdSzocNEuxd52QRK9bjWcJvpgBPRWqc9w`
		}, error => {this.utils.display_error(error);});
	}

	dismiss() {
		this.navCtrl.pop();
	}

	choose() {
		this.navCtrl.push(Final, {restaurant: this.details, loc: this.location})
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
