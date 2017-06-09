import { Component } from '@angular/core';
import { Events, NavController, AlertController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { Filter } from '../filter/filter';
import { Account } from '../account/account';
import { MoreInfo } from '../info/info';
import { Display } from '../display/display';
import { Search } from '../search/search';
import { Notifications } from '../notifications/notifications';
import { UserService } from '../../providers/user-service';
import { MunchrApi } from '../../providers/munchr-api';
import { Utils } from '../../utils'

@Component({
	selector: 'page-main',
	templateUrl: 'main.html',
	providers: [ MunchrApi, UserService ],
})
export class Main {
	distance: number = 5;
	cuisines: Array<string> = [];
	loading: boolean = true;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string,
	};
	selection: string = 'newCuisine';
	activity: Array<any> = [];
	notifications: {requests: Array<any>, recommendations: Array<any>};


	constructor(
		private utils: Utils,
		private events: Events,
		private munchrApi: MunchrApi,
		public userService: UserService,
		private navCtrl: NavController,
		private alertCtrl: AlertController,
	) {
		utils.show_tutorial('Welcome to Munchr. This is the main page. To search for a restaurant first select what you\'re looking for and tap Search.');

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

	search() {
		let distance = this.distance;
		distance = (distance*distance*distance/320) + (320 - (distance*distance*distance)%320)/320;
		if (this.selection === 'newRestaurant') {
			this.navCtrl.push(Display, {
				radius: distance,
				cuisines: [],

			});
		} else {
			this.navCtrl.push(Filter, {
				distance,
				cuisines: this.cuisines,
				selection: this.selection,
			});
		}

	}

	after_get_user(){
		this.broadcast_login();
		this.get_activity();
		this.get_notifications();
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

	broadcast_login() {
		this.events.publish('user:login', this.user);
	}

	view_account(user:any) {
		this.navCtrl.push(Account, { user: user });
	}

	view_restaurant(res_id:string) {
		this.navCtrl.push(MoreInfo, { res_id });
	}

	viewDidEnter() {
		this.get_activity();
	}

	view_notifications() {
		this.navCtrl.push(Notifications, {notifications: this.notifications});
	}

	get_notifications() {
		this.munchrApi.notifications(this.user.user_id)
		.then(data => {
			this.notifications = data.results;
		}, error => { });
	}

	add_friends() {
		this.navCtrl.push(Search, {
			user_id: this.user.user_id
		});
	}
}
