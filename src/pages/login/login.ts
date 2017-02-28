import { Component } from '@angular/core';

import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';

import { Main } from '../main/main';
import { Create } from '../create/create';

import { AuthService } from '../../providers/auth-service'

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [ AuthService ]
})
export class Login {
	email: string;
	password: string;
	loading: Loading;

	constructor(
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		public authService: AuthService,
		public loadingCtrl: LoadingController
	) { }

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

	create_account() {
		this.navCtrl.push(Create);
	}
}
