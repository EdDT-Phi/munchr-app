import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';

import { Filter } from '../filter/filter';
import { Account } from '../account/account';
import { MoreInfo } from '../info/info';
import { Search } from '../search/search';
import { Notifications } from '../notifications/notifications';
import { UserService } from '../../providers/user-service';
import { MunchrApi } from '../../providers/munchr-api';
import { Utils } from '../../utils'

@Component({
	selector: 'page-main',
	templateUrl: 'main.html',
})
export class Main {
	cuisines: Array<string> = [];
	loading: boolean = true;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string,
	};
	activity: Array<any>;
	notifications: {requests: Array<any>, recommendations: Array<any>};

	constructor(
		private utils: Utils,
		private munchrApi: MunchrApi,
		public userService: UserService,
		private events: Events,
		private navCtrl: NavController,
	) {
		utils.show_tutorial('main_page', 'Welcome to Munchr. This is the main page. To search for a restaurant just tap Search.');

		this.userService.get_user()
		.then(user => {
			this.user = user;
			this.after_get_user();
		}, error => { });

		this.munchrApi.filters()
		.then( data => {
			if(data.error) {
				this.utils.display_error(data.error);
			} else {
				this.cuisines = data.results;
			}
			this.loading = false;
		});
	}

	ionViewWillEnter() {
		if (this.user) {
			this.notifications = null;
			this.get_activity();
			this.get_notifications();
		}
	}

	after_get_user(){
		this.broadcast_login();
		this.get_activity();
		this.get_notifications();
	}

	broadcast_login() {
		this.events.publish('user:login', this.user);
	}

	get_activity() {
		this.munchrApi.friends_activity(this.user.user_id)
		.then(data => {
			if(data.error) {
				this.utils.display_error(data.error);
			} else {
				this.activity = data.results;
			}
		});
	}

	get_notifications() {
		this.munchrApi.notifications(this.user.user_id)
		.then(data => {
			this.notifications = data.results;
		}, error => { });
	}

	view_notifications() {
		this.navCtrl.push(Notifications, {notifications: this.notifications});
	}
	
	view_account(user:any) {
		this.navCtrl.push(Account, { user: user });
	}

	view_restaurant(res_id:string) {
		this.navCtrl.push(MoreInfo, { res_id });
	}

	add_friends() {
		this.navCtrl.push(Search, {
			user_id: this.user.user_id
		});
	}
	
	search() {
		this.navCtrl.push(Filter, {
			cuisines: this.cuisines,
		});
	}
}
