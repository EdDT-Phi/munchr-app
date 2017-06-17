import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
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
		timestamp: number, // milliseconds
	} = null;

	constructor(
		private http: Http,
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
					this.user.timestamp = Date.now();
					resolve(this.user);

				}, error => {
					// Not logged in
					this.get_user_login(resolve);

					// this.user = {user_id: 3, first_name:'Tyler', last_name:'Camp', photo_url:'', token:'test-token', timestamp: Date.now()}
					// resolve(this.user);
				});
			});
		});
	}

	get_user_token(): Promise<string> {
		if (Date.now() < this.user.timestamp + (1000 * 60 * 60)) {
			return Promise.resolve(this.user.token);
		} 

		return new Promise(resolve => {
			const headers = new Headers();
			headers.append('Content-Type', 'application/x-www-form-urlencoded');
			const options = new RequestOptions({ headers: headers });

			const obj = {
				user_id: this.user.user_id,
				old_token: this.user.token,
			}

			const data = Object.keys(obj).map(function(key) {
			    return key + '=' + obj[key];
			}).join('&');


			this.http.post(this.url + '/auth/token/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.user.token = data.token;
				this.user.timestamp = Date.now();
				resolve(data.token);
			}, error => {
				setTimeout(() => {
					this.get_user_token()
					.then(token => {
						resolve(token);
					});
				}, 5000);
			});
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
			this.user.timestamp = Date.now();
			return resolve(this.user);
		});
	}

	logout() {
		this.user = null;
		this.nativeStorage.remove("user")
		.then(success => { }, error => { });
	}
}
