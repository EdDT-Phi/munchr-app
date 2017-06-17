import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ModalController } from 'ionic-angular';

import { MoreInfo } from '../info/info';
import { MunchrApi } from '../../providers/munchr-api';

@Component({
	selector: 'page-stars',
	templateUrl: 'stars.html',
})
export class Stars {

	stars: Array<{
		res_id: string,
		res_name: string,
	}>;
	loading: Loading = null;


	constructor(
		private navCtrl: NavController,
		private munchrApi: MunchrApi,
		private navParams: NavParams,
		private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
	) {
		this.get_stars();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad StarsPage');
	}

	get_stars() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		this.munchrApi.get_stars()
		.then(data => {
			console.log(data);
			this.stars = data.results;
			this.loading.dismiss();
		}, error => { });
	}

	star_res(res_id: string) {
		this.munchrApi.unstar_res(res_id)
		.then(data => {
			this.stars = data.results;
		}, error => {});
	}

	view_restaurant(res_id:string) {
		this.navCtrl.push(MoreInfo, { res_id });
	}
}
