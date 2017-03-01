import { Component } from '@angular/core';

import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';

import { Main } from '../main/main';
import { Create } from '../create/create';

import { AuthService } from '../../providers/auth-service'
import {Facebook, NativeStorage} from "ionic-native";

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
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		public authService: AuthService,
		public loadingCtrl: LoadingController
	) {

		Facebook.browserInit(this.FB_APP_ID, "v2.8");
	}

	login () {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		
		this.loading.present();
		this.authService.login(this.email, this.password)
		.then( data => {
			this.loading.dismiss();
			console.log(data);
			if (data.error) {
				let toast = this.toastCtrl.create({
				  message: data.error,
				  duration: 3000
				});
				toast.present();
			} else {
				this.navCtrl.setRoot(Main);
			}
		});
	}

	facebook_login() {
		const permissions = [];

		Facebook.login(permissions)
			.then( response => {
				let fb_id = response.authResponse.userID;

				Facebook.api('/me', ['public_profile', 'user_friends', 'email'])
					.then( user => {
						console.log(user);
						user.picture = `https://graph.facebook.com/${fb_id}/picture?type=large`;
						NativeStorage.setItem('user', {
							name: user.name,
							gender: user.gender,
							picture: user.picture
						}).then( () => {
							this.navCtrl.push(Main);
						}, error => {
							console.log(error);
						});
					})
			}, error => {
				console.log(error);
			});
	}

	create_account() {
		this.navCtrl.push(Create);
	}
}
