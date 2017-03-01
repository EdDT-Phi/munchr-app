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

		else {
			this.navCtrl.setRoot(Main);
		}

		// this.loading = this.loadingCtrl.create({
		// 	content: 'Please wait...'
		// });
		
		// this.loading.present();


	}

	generate_error(err) {
		let toast = this.toastCtrl.create({
		  message: err,
		  duration: 3000,
		  position: 'bottom'
		});
		toast.present();
	}

	// create_account = function() {
	// 	this.navCtrl.setRoot(Main);
	// }
}
