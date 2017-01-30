import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {Main} from '../main/main';

import {Create} from '../create/create';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {

	constructor(public navCtrl: NavController) {

	}

	login = function() {
		this.navCtrl.setRoot(Main);
	}

	create_account = function() {
		this.navCtrl.setRoot(Create);
	}
}
