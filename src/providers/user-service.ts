import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions } from '@angular/http';
import { ModalController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';
import 'rxjs/add/operator/map';

import { Login } from '../pages/login/login';


/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {
	data: any;
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
	} = null;

	constructor(private modalCtrl: ModalController) {
		// this.url = 'http://localhost:5000'; // dev
		this.url = 'https://munchr-test.herokuapp.com'; // test
		// this.url = 'https://munchr.herokuapp.com'; // prod
	}

	get_user() {
		if (this.user)
			return Promise.resolve(this.user);

		return new Promise(resolve => {
			NativeStorage.getItem('user')
			.then( data => {
				this.user = data;
				resolve(this.user);

			}, error => {
				// Not logged in
				this.get_user_login(resolve);

				// this.user = {user_id: 3, first_name:'Tyler', last_name:'Camp', photo_url:''}
				// resolve(this.user);
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
			return resolve(this.user);
		});
	}
}
