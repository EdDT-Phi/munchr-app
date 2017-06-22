import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';
import { Account } from '../account/account';
import { Search } from '../search/search';

@Component({
	selector: 'page-friends',
	templateUrl: 'friends.html',
})


export class Friends {
	requests: Array<any>;
	friends: Array<any>;
	loading: Loading = null;

	constructor(
		private navParams: NavParams,
		private munchrApi: MunchrApi,
		private navCtrl: NavController,
		private loadingCtrl: LoadingController,
	) {

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();

		this.get_friends();
	}

	view_account(user:any) {
		this.navCtrl.push(Account, { user });
	}

	get_friends(){
		this.munchrApi.get_friends()
		.then(data => {
			console.log('got friends: ', data);
			this.requests = data.result.requests;
			this.friends = data.result.friends;
			this.loading.dismiss();
			this.loading = null;
		}, error => {});
	}

	respond(response:boolean, oth_user:any) {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		this.munchrApi.respond_request(response, oth_user.user_id)
		.then(data => {
			console.log(data);
			this.requests = data.result.requests;
			this.friends = data.result.friends;
			this.loading.dismiss();
			this.loading = null;
		}, error => {});
	}

	search_users() {
		this.navCtrl.push(Search);
	}
}
