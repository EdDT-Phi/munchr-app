import { Component } from '@angular/core';

import { NavParams, NavController, LoadingController, Loading, ViewController } from 'ionic-angular';
import { NativeStorage } from "ionic-native";

import { AuthService } from '../../providers/auth-service'

import { Utils } from '../../utils'

@Component({
	selector: 'page-login',
	templateUrl: 'create.html',
	providers: [ AuthService ]
})
export class Create {
	first_name: string ='';
	last_name: string ='';
	email: string ='';
	password: string ='';
	repeatPassword: string =''; 
	loading: Loading;
	login_viewCtrl: ViewController;

	constructor(
		public navParams: NavParams,
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public authService: AuthService,
		public viewCtrl: ViewController,
		public utils: Utils,
	) {

		this.login_viewCtrl = this.navParams.get('login_viewctrl')

	}

	create_account() {
		//Check all fields are filled
		if(!this.first_name || !this.last_name || !this.email || !this.password || !this.repeatPassword){
			return this.utils.display_error('All fields must be filled.');
		} 

		// password and repeat password match
		if(this.password != this.repeatPassword) {
			return this.utils.display_error('Passwords do not match.');
		} 

		// Check password is 8-16 characters
		if(this.password.length < 8 || this.password.length > 16) {
			return this.utils.display_error('Password must be 8-16 characters.');
		} 

		// Check if valid email
		if(!Create.validateEmail(this.email)){
			return this.utils.display_error('Email must be a valid email address.');
		}

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		
		this.loading.present();
		this.authService.create_account(this.first_name, this.last_name, this.email, this.password)
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
	}

	save_and_login(user) {
		// Uncomment this for production
		NativeStorage.setItem('user', user).then(() => {
			this.login_viewCtrl.dismiss(user);
			this.navCtrl.pop();
		}, error => {
			this.utils.display_error(error);
			this.login_viewCtrl.dismiss(user);
			this.navCtrl.pop();
		});
	}


	static validateEmail(email) {
  		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  		return re.test(email);
	}



}
