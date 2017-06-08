import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Account } from '../account/account';
import { UserService } from '../../providers/user-service';
import { MunchrApi } from '../../providers/munchr-api';


@Component({
	selector: 'page-search',
	templateUrl: 'search.html',
	providers: [ MunchrApi, UserService ],
})
export class Search {

	last_changed: number = 0;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};
	users: Array<{
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string,
	}>

	constructor(
		private munchrApi: MunchrApi,
		private userService: UserService,
		private navCtrl: NavController,
	) {
		this.userService.get_user()
		.then(user => {
			this.user = user;
		}, error => { });
	}

	search_users(event) {
		if (event.target.value == '')  return; 
		this.munchrApi.search_users(this.user.user_id, event.target.value)
		.then(data => {
			this.users = data.results;
		})
	}

	view_account(user:any) {
		this.navCtrl.push(Account, { user });
	}
}
