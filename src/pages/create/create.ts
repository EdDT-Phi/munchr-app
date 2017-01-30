import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {Main} from '../main/main';

@Component({
	selector: 'page-login',
	templateUrl: 'create.html'
})
export class Create {

	constructor(public navCtrl: NavController) {

	}

	create_account = function() {
		this.navCtrl.setRoot(Main);
	}
}
