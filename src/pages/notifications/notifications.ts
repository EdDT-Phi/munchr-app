import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ModalController } from 'ionic-angular';

import { Account } from '../account/account'; 
import { MoreInfo } from '../info/info'; 
import { MunchrApi } from '../../providers/munchr-api';
import { UserService } from '../../providers/user-service';


@Component({
	selector: 'page-notifications',
	templateUrl: 'notifications.html',
	providers: [ MunchrApi, UserService ],
})
export class Notifications {

	requests: Array<any>;
	recommendations: Array<any>;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};
	loading: Loading = null;

	constructor(
		private navParams: NavParams,
		private userService: UserService,
		private munchrApi: MunchrApi,
		private navCtrl: NavController,
		private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
	) {

		const notifications = navParams.get('notifications');
		if (notifications) {
			this.requests = notifications.requests;
			this.recommendations = notifications.recommendations;
		}

		this.userService.get_user()
		.then(user => {
			this.user = user;
			if (!notifications)
				this.get_notifications();
		}, error => { });
	}

	ionViewDidLoad() {

	}

	get_notifications() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		this.munchrApi.notifications(this.user.user_id)
		.then(data => {
			console.log(data);
			this.requests = data.results.requests;
			this.recommendations = data.results.recommendations;
			this.loading.dismiss();
		}, error => { });
	}

	view_account(user:any) {
		const modal = this.modalCtrl.create(Account, { user });
		modal.present();
		modal.onDidDismiss(()=> {
			this.get_notifications();
		});
	}

	view_restaurant(res_id: string) {
		this.navCtrl.push(MoreInfo, { res_id });
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
			this.loading.dismiss();
			this.loading = null;
		}, error => {});
	}

	dismiss(index: number) {
		const recomm = this.recommendations.splice(index, 1)[0];
		this.munchrApi.dismiss_recommendation(recomm.user_id, this.user.user_id, recomm.res_id)
		.then(() => {}, error => {})
	}
}
