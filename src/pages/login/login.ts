import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { NavController, ToastController } from 'ionic-angular';

import { Main } from '../main/main';
import { Create } from '../create/create';

import { AuthService } from '../../providers/auth-service'

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [AuthService]
})
export class Login {
	email: string;
	password: string;

	constructor(public navCtrl: NavController, public http: Http, public toastCtrl: ToastController, public authService: AuthService) {

	}

	login = function() {
		console.log(this.email, this.password);

		this.authService.login(this.email, this.password)
			.then( data => {
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

	create_account = function() {
		this.navCtrl.push(Create);
	}
}
