import { Component } from '@angular/core';

import { NavController, LoadingController, Loading, ViewController, ModalController } from 'ionic-angular';
import { Facebook, NativeStorage } from "ionic-native";

import { Create } from '../create/create';

import { AuthService } from '../../providers/auth-service'

import { Utils } from '../../utils'

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [ AuthService ]
})
export class Login {
	email:string = '';
	password:string = '';
	loading:Loading;
	FB_APP_ID:number = 326434787728030;

	constructor(
		public navCtrl: NavController,
		public authService: AuthService,
		public modalCtrl: ModalController,
		public loadingCtrl: LoadingController,
		public utils: Utils,
		public viewCtrl: ViewController,
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
				this.save_and_login( {
					user_id: data.result.user_id,
					fb_id: data.result.fb_id,
					first_name: data.result.first_name,
					last_name: data.result.last_name,
					email: data.result.email,
					photo: data.result.picture,
				});
			}
		}, error => {
			this.utils.display_error(error);
		});
	}

	facebook_login() {
		const permissions = ['public_profile', 'user_friends', 'email'];

		Facebook.login(permissions)
		.then(response => {
			let fb_id = response.authResponse.userID;

			Facebook.api('/me?fields=id,first_name,last_name,email,picture', ['public_profile', 'user_friends', 'email'])
			.then(user => {
				console.log(user);
				user.picture = `https://graph.facebook.com/${fb_id}/picture?type=large`;
				Facebook.api('/me/friends', ['user_friends'])
				.then(data => {
					// send friends data to back end
				});
				this.authService.create_account(user.first_name, user.last_name, user.email, null, fb_id, user.picture)
				.then(data => {
					this.loading.dismiss();
					console.log(data);
					if (data.error) {
						this.utils.display_error(data.error);
					} else {
						this.save_and_login( {
							user_id: data.result.user_id,
							fb_id: data.result.fb_id,
							first_name: data.result.first_name,
							last_name: data.result.last_name,
							email: data.result.email,
							photo: data.result.picture,
						});
					}
				});
			});
		}, error => {
			this.utils.display_error(error);
		});
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
