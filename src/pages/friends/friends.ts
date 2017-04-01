import { Component } from '@angular/core';

import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { MunchrApi } from '../../providers/munchr-api';
import { Account } from '../account/account';

@Component({
	selector: 'page-friends',
	templateUrl: 'friends.html',
	providers: [ MunchrApi ],
})


export class Friends {

	user: any = {};
	requests: Array<any>;
	friends: Array<any>;
	loading: Loading;

	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private munchrApi: MunchrApi,
		private loadingCtrl: LoadingController,
	) {

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();

		NativeStorage.getItem('user')
		.then(user => {
			// const user = {
			// 	user_id: 3
			// };
			this.user = user;
			this.get_friends();
		}, error => {});
	}

	view_account(user:any, type: string) {
		this.navCtrl.push(Account, {user: {
				user_id: user.user_id,
				photo_url: user.photo_url,
				first_name: user.first_name,
				last_name: user.last_name,
				type: type
			}
		});
	}

	get_friends(){
		this.munchrApi.get_friends(this.user.user_id)
		.then(data => {
			console.log(data);
			this.requests = data.result.requests;
			this.friends = data.result.friends;
			this.loading.dismiss();
		}, error => {});
	}

	respond(response:boolean, oth_user:any) {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present()
		this.munchrApi.respond_request(response, this.user.user_id, oth_user.user_id)
		.then(data => {
			console.log(data);
			this.requests = data.result.requests;
			this.friends = data.result.friends;
			this.loading.dismiss();
		}, error => {});
	}
}
