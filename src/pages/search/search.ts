import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Account } from '../account/account';
import { MunchrApi } from '../../providers/munchr-api';


@Component({
	selector: 'page-search',
	templateUrl: 'search.html',
})
export class Search {

	last_changed: number = 0;
	users: Array<{
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string,
	}>

	constructor(
		private munchrApi: MunchrApi,
		private navCtrl: NavController,
	) {	}

	search_users(event) {
		if (event.target.value == '')  return; 
		this.munchrApi.search_users(event.target.value)
		.then(data => {
			this.users = data.results;
		})
	}

	view_account(user:any) {
		this.navCtrl.push(Account, { user });
	}
}
