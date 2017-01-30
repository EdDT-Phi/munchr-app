import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {Page2} from '../page2/page2';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {

	constructor(public navCtrl: NavController) {

	}

	login = function() {
		this.navCtrl.setRoot(Page2);
	}
}
