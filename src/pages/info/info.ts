import { Component } from '@angular/core';
import { SocialSharing, LaunchNavigator, LaunchNavigatorOptions } from 'ionic-native';
import { NavParams, ViewController, LoadingController, Loading, NavController, AlertController } from 'ionic-angular';

import { Main } from '../main/main';

import { MunchrApi } from '../../providers/munchr-api';
import { LocationProvider } from '../../providers/location';

import { Utils } from "../../utils";

@Component({
	selector: 'page-info',
	templateUrl: 'info.html',
})
export class MoreInfo {

	loading: Loading = null;
	map: string;
	details: {
		res_id: string,
		name: string,
		phone: string,
		website: string,
		price:string,
		opennow: boolean,
		reviews: Array<any>,
		photos: Array<any>,
		rating: number,
		location: {
			lat: number,
			lng: number,
			distance: number,
			address: string,
		},
		starred: boolean,
	};
	location: {
		lat: number,
		lng: number,
	};
	
	constructor(
		private utils: Utils,
		private munchrApi: MunchrApi, 
		private locationProvider: LocationProvider, 
		private navParams: NavParams,
		private navCtrl: NavController,
		private viewCtrl: ViewController,
		private alertCtrl: AlertController,
		private loadingCtrl: LoadingController,
	) {

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();


		this.get_details(this.navParams.get('res_id'));
	}

	navigate() {
		let options: LaunchNavigatorOptions = {}

		LaunchNavigator.navigate([this.details.location.lat, this.details.location.lng], options)
		.then (
			success => console.log('Yay! ', success),
			error => this.utils.display_error(error)
		);
	}

	get_details(res_id:string) {

		this.location = this.locationProvider.get_user_position()
		this.api_request(res_id, this.location.lat, this.location.lng);
	}

	api_request(res_id:string, lat:number, lng:number) {
		this.location = {lat, lng};
		this.munchrApi.details(res_id, lat, lng)
		.then( data => {
			this.loading.dismiss();
			this.loading = null;

			this.details = data.result;
			this.map = `https://maps.googleapis.com/maps/api/staticmap
			?size=500x300
			&markers=color:0xff4e00%7clabel:R%7C${this.details.location.lat},${this.details.location.lng}
			&markers=color:blue%7Clabel:Y%7C${lat},${lng}
			&key=AIzaSyCdSzocNEuxd52QRK9bjWcJvpgBPRWqc9w`
		}, error => {this.utils.display_error(error);});
	}

	done() {

		this.munchrApi.munch(this.details.res_id)
		.then(success => {
			let confirm = this.alertCtrl.create({
				title: 'Would you like to share this restaurant?',
				// message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
				buttons: [
				{
					text: 'Nah',
					handler: () => {
						this.navCtrl.setRoot(Main)
					}
				}, 
				{
					text: 'Yes!',
					handler: () => {
						this.share_res(true);
					}
				}], 
				enableBackdropDismiss: false
			});
			confirm.present();
		}, error => {
			this.utils.display_error(error);
		});
	}

	share_res(final:boolean) {
		SocialSharing.shareWithOptions({
			message: 'Let\'s munch here!',
			subject: 'Munchr: going out to eat',
			url: `https://www.munchr.site/restaurants/${this.details.res_id}`
		}).then(success => {
			if (final)
				this.navCtrl.setRoot(Main)
		}, error => {
			this.utils.display_error(error);
			if (final)
				this.navCtrl.setRoot(Main)
		});
	}

	star_res() {
		if (!this.details.starred) {
			this.munchrApi.star_res(this.details.res_id)
			.then(() => {
				this.details.starred = true;
			}, error => {});
		} else {
			this.munchrApi.unstar_res(this.details.res_id)
			.then(() => {
				this.details.starred = false;
			}, error => {});
		}
	}
}
