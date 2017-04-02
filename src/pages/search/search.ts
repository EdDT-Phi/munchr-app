import { Component } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';

import { Account } from '../account/account';
import { MunchrApi } from '../../providers/munchr-api';


@Component({
	selector: 'page-search',
	templateUrl: 'search.html',
	providers: [ MunchrApi ],
})
export class Search {

	last_changed: number = 0;
	user_id: number;
	users: Array<{
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string}>

	constructor(
		private navParams: NavParams,
		private munchrApi: MunchrApi,
		private viewCtrl: ViewController,
		private navCtrl: NavController,
	) {
		this.user_id = this.navParams.get('user_id');
	}

	ionViewDidLoad() {

	}

	search_users(event) {
		if (event.target.value == '')  return; 
		this.munchrApi.search_users(this.user_id, event.target.value)
		.then(data => {
			this.users = data.results;
		})
	}

	view_account(user:any) {
		this.navCtrl.push(Account, { user });
	}

	back() {
		this.viewCtrl.dismiss();
	}
}