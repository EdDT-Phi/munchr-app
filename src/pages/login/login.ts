import { Component } from '@angular/core';

import { NavController, LoadingController, Loading, ViewController, ModalController } from 'ionic-angular';
import { Facebook, NativeStorage } from "ionic-native";

import { Create } from '../create/create';

import { AuthService } from '../../providers/auth-service';

import { Utils } from '../../utils';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [ AuthService ]
})
export class Login {
	email: string = '';
	password: string = '';
	loading: Loading;
	FB_APP_ID: number = 326434787728030;

	constructor(
		public utils: Utils,
		public authService: AuthService,
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		public modalCtrl: ModalController,
		public loadingCtrl: LoadingController,
	) {

		Facebook.browserInit(this.FB_APP_ID, "v2.8");

	}

	login() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		this.loading.present();
		this.authService.login(this.email.trim(), this.password)
		.then(data => {
			this.loading.dismiss();
			console.log(data);
			if (data.error) {
				this.utils.display_error(data.error);
			} else {
				this.save_and_login(data.result);
			}
		}, error => this.utils.display_error(error));
	}

	facebook_login() {
		const permissions = ['public_profile', 'user_friends', 'email'];
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		Facebook.login(permissions)
		.then(response => {
			let fb_id = response.authResponse.userID;

			Facebook.api('/me?fields=id,first_name,last_name,email,picture', ['public_profile', 'user_friends', 'email'])
			.then(user => {
				console.log(user);
				user.picture = `https://graph.facebook.com/${fb_id}/picture?type=large`;
				Facebook.api('/me/friends', ['user_friends'])
				.then(friends_data => {
					const friends = friends_data.data.map((item) => item.id);
					this.authService.facebook_login(user.first_name, user.last_name, user.email, fb_id, user.picture, friends)
					.then(data => {
						this.loading.dismiss();
						console.log(data);
						if (data.error) {
							this.utils.display_error(data.error);
						} else {
							this.save_and_login(data.result);
						}
					}, error => this.utils.display_error(error));
				}, error => this.utils.display_error(error));
			}, error => this.utils.display_error(error));
		}, error => this.utils.display_error(error));
	}

	create_account() {
		let modal = this.modalCtrl.create(Create);
		modal.present();
		modal.onDidDismiss(data => {
			this.viewCtrl.dismiss(data);
		});
	}
	
	save_and_login(user) {
		// Uncomment this for production
		NativeStorage.setItem('user', user)
		.then(() => {
			this.viewCtrl.dismiss(user);
		}, error => {
			this.utils.display_error(error);
			this.viewCtrl.dismiss(user);
		});
	}
}
