import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ModalController } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';
import { UserService } from '../../providers/user-service';
import { Account } from '../account/account';
import { Search } from '../search/search';

@Component({
	selector: 'page-friends',
	templateUrl: 'friends.html',
	providers: [ MunchrApi, UserService ],
})


export class Friends {

	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};
	requests: Array<any>;
	friends: Array<any>;
	loading: Loading = null;

	constructor(
		private navParams: NavParams,
		private munchrApi: MunchrApi,
		private userService: UserService,
		private navCtrl: NavController,
		private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
	) {

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();

		this.userService.get_user()
		.then(user => {
			this.user = user;
			this.get_friends();
		}, error => { });
	}

	view_account(user:any) {
		const modal = this.modalCtrl.create(Account, { user });
		modal.present();
		modal.onDidDismiss(()=> {
			this.loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			this.loading.present();
			this.get_friends();
		});
	}

	get_friends(){
		this.munchrApi.get_friends(this.user.user_id)
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
		this.munchrApi.respond_request(response, this.user.user_id, oth_user.user_id)
		.then(data => {
			console.log(data);
			this.requests = data.result.requests;
			this.friends = data.result.friends;
			this.loading.dismiss();
			this.loading = null;
		}, error => {});
	}

	search_users() {
		this.modalCtrl.create(Search, {
			user_id: this.user.user_id
		}).present();
	}
}
