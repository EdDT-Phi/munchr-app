import { Component } from '@angular/core';
import { NativeStorage } from 'ionic-native';
import { NavController, NavParams, Loading, LoadingController, ModalController } from 'ionic-angular';

import { MoreInfo } from '../info/info';
import { MunchrApi } from '../../providers/munchr-api';

@Component({
	selector: 'page-stars',
	templateUrl: 'stars.html',
	providers: [ MunchrApi ],
})
export class Stars {

	stars: Array<{
		res_id: string,
		res_name: string,
	}>;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};
	loading: Loading = null;


	constructor(
		private munchrApi: MunchrApi,
		private navParams: NavParams,
		private navCtrl: NavController,
		private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
	) {

		NativeStorage.getItem('user')
		.then(user => {
			this.user = user;
			this.get_stars();
		}, error => {
			// this.user = {user_id: 3, first_name:'Tyler', last_name:'Camp', photo_url:''}
			// this.get_stars();
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad StarsPage');
	}

	get_stars() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		this.munchrApi.get_stars(this.user.user_id)
		.then(data => {
			console.log(data);
			this.stars = data.results;
			this.loading.dismiss();
		}, error => { });
	}

	star_res(res_id: string) {
		this.munchrApi.unstar_res(this.user.user_id, res_id)
		.then(data => {
			this.stars = data.results;
		}, error => {});
	}

	view_restaurant(res_id:string) {
		this.navCtrl.push(MoreInfo, { res_id });
	}
}
