import { Injectable } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/map';

import { Login } from '../pages/login/login';
import { Utils } from '../utils';

@Injectable()
export class UserService {
	url: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	fb_id: string;
	photo: string;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string,
		token: string,
	} = null;

	constructor(
		private platform: Platform,
		private modalCtrl: ModalController,
		private nativeStorage: NativeStorage,
		private utils: Utils,
	) {
		// this.url = 'http://localhost:5000'; // dev
		this.url = 'https://munchr-test.herokuapp.com'; // test
		// this.url = 'https://munchr.herokuapp.com'; // prod
	}

	get_user(): Promise<any> {
		if (this.user)
			return Promise.resolve(this.user);

		return new Promise(resolve => {

			this.platform.ready().then(() => {
				this.nativeStorage.getItem('user')
				.then( data => {
					this.user = data;
					resolve(this.user);

				}, error => {
					// Not logged in
					this.get_user_login(resolve);

					// this.user = {user_id: 3, first_name:'Tyler', last_name:'Camp', photo_url:'', token:'test-token'}
					// resolve(this.user);
				});
			});
		});
	}

	get_user_token(): Promise<{token:string, user_id:number}> {
		if (this.user && this.user.token) {
			return Promise.resolve({token: this.user.token, user_id: this.user.user_id});
		}

		return new Promise(resolve => {
			this.get_user_login(resolve);
		});
	}

	get_user_login(resolve:any) {
		let modal = this.modalCtrl.create(Login);
		modal.present();
		modal.onDidDismiss(data => {
			if (!data){
				return this.get_user_login(resolve);
			}
			this.user = data;
			return resolve(this.user);
		});
	}

	logout() {
		this.user = null;
		this.nativeStorage.remove("user")
		.then(success => { }, error => { });
	}
}
