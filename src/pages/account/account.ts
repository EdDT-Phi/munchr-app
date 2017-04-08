import { Component } from '@angular/core';
import { NativeStorage } from 'ionic-native';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { MoreInfo } from '../info/info';
import { Final } from '../final/final';
import { MunchrApi } from '../../providers/munchr-api';
import { Utils } from '../../utils';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html',
	providers: [ MunchrApi ],
})


export class Account {
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};
	other_user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};
	type: string = 'loading';
	activity: Array<any> = [];


	constructor(
		public utils: Utils,
		public navParams: NavParams,
		public munchrApi: MunchrApi,
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		private modalCtrl: ModalController,
	) {

		this.other_user = this.navParams.get('user');
		NativeStorage.getItem('user')
		.then( user => {
			this.user = user;
			this.get_activity();
		}, error => {
			// this.user = {user_id: 3, first_name:'Tyler', last_name:'Camp', photo_url:''}
			// this.get_activity();

		})

	}

	get_activity() {
		this.munchrApi.activity(this.user.user_id, this.other_user.user_id)
		.then(data => {
			console.log('got activity', data)
			if(data.error) {
				this.utils.display_error(data.error);
			} else {
				this.activity = data.result.activity;
				this.type = data.result.type;
			}
		});
	}

	respond(response:boolean, user_id:number, other_id:number) {
		this.type = 'loading';
		this.munchrApi.respond_request(response, user_id, other_id)
		.then(data => {
			this.get_activity();
		}, error => {});
	}

	request() {
		this.type = 'loading';
		this.munchrApi.friend_request(this.user.user_id, this.other_user.user_id)
		.then(data => {
			this.get_activity();
		}, error => {});
	}

	delete_friend() {
		this.type = 'loading';
		this.munchrApi.delete_friend(this.user.user_id, this.other_user.user_id)
		.then(data => {
			this.get_activity();
		}, error => {})
	}

	view_restaurant(res_id:string) {
		const modal = this.modalCtrl.create(MoreInfo, { res_id });
		modal.present();
		modal.onDidDismiss(details => {
			if (details) {
				this.navCtrl.push(Final, { restaurant: details })
			}
		});
	}

	back() {
		this.viewCtrl.dismiss();
	}
}
