import { Component } from '@angular/core';
import { NativeStorage } from 'ionic-native';
import { NavController, NavParams } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';


@Component({
	selector: 'page-notifications',
	templateUrl: 'notifications.html',
	providers: [ MunchrApi ],
})
export class Notifications {

	requests: Array<any>;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};

	constructor(
		private navParams: NavParams,
		private munchrApi: MunchrApi,
		private navCtrl: NavController,
	) {

		const notifications = navParams.get('notifications');
		if (notifications)
			this.requests = notifications.requests;

		NativeStorage.getItem('user')
		.then(user => {
			this.user = user;
			if (!notifications)
				this.get_notifications();
		}, error => {
			this.user = {user_id: 3, first_name:'Tyler', last_name:'Camp', photo_url:''}
			if (!notifications)
				this.get_notifications();
		});

	}

	ionViewDidLoad() {

	}

	get_notifications() {
		this.munchrApi.notifications(this.user.user_id)
		.then(data => {
			this.requests = data.results.requests;
		}, error => { });
	}
}
