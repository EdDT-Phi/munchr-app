import { Component } from '@angular/core';

import { Events, NavController, NavParams } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';
import { Utils } from '../../utils';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html',
	providers: [ MunchrApi ],
})


export class Account {
	user:any = {};
	activity: Array<any> = [];


	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public events: Events,
		public munchrApi: MunchrApi,
		public utils: Utils,
	) {
		this.user = this.navParams.get('user');

		if (this.user.type === 'friend') {
			this.munchrApi.activity(this.user.user_id)
			.then(data => {
				console.log('got activity', data)
				if(data.error) {
					this.utils.display_error(data.error);
				} else {
					this.activity = data.results;
				}
			});
		}
	}
}
