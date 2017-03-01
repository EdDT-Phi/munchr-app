import { Component } from '@angular/core';

import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';

import { Main } from '../main/main';

import { AuthService } from '../../providers/auth-service'

@Component({
	selector: 'page-login',
	templateUrl: 'create.html',
	providers: [ AuthService ]
})
export class Create {
	firstName: string ='';
	lastName: string ='';
	email: string ='';
	password: string ='';
	repeatPassword: string =''; 
	loading: Loading;

	constructor(public navCtrl: NavController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController ) {}

	create_account() {
		//Check all fields are filled
		if(!this.firstName || !this.lastName || !this.email || !this.password || !this.repeatPassword){
			return this.generate_error('All fields must be filled.');
		} 

		// password and repeat password match
		if(this.password != this.repeatPassword) {
			return this.generate_error('Passwords do not match.');
		} 

		// Check password is 8-16 characters
		if(this.password.length < 8 || this.password.length > 16) {
			return this.generate_error('Password must be 8-16 characters.');
		} 

		// Check if valid email
		if(!this.validateEmail(this.email)){
			return this.generate_error('Email must be a valid email address.');
		}

		// this.loading = this.loadingCtrl.create({
		// 	content: 'Please wait...'
		// });
		
		// this.loading.present();
		// this.authService.create_account(this.firstName, this.lastName, this.email, this.password);

		else {
			this.navCtrl.setRoot(Main);
		}

	}

	generate_error(err) {
		let toast = this.toastCtrl.create({
		  message: err,
		  duration: 3000,
		  position: 'bottom'
		});
		toast.present();
	}

	validateEmail(email) {
  		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  		return re.test(email);
	}

}
