import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';

import { MoreInfo } from '../info/info'; 
import { MunchrApi } from '../../providers/munchr-api';
import { UserService } from '../../providers/user-service';

import { Utils } from '../../utils';

@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
	providers: [ MunchrApi, UserService ],
})
export class History {

	history: Array<any>;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};
	loading: Loading = null;

	constructor(
		public utils: Utils,
		private navParams: NavParams,
		private userService: UserService,
		private munchrApi: MunchrApi,
		private navCtrl: NavController,
		private alertCtrl: AlertController,
		private loadingCtrl: LoadingController,
	) {

		this.userService.get_user()
		.then(user => {
			this.user = user;
			this.get_history();
		}, error => { });

	}

	get_history() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		this.munchrApi.activity(this.user.user_id, this.user.user_id)
		.then(data => {
			console.log('got activity', data)
			if(data.error) {
				this.utils.display_error(data.error);
				this.loading.dismiss();
				this.loading = null;
			} else {
				this.history = data.result.activity;
				this.loading.dismiss();
				this.loading = null;
			}
		});
	}

	view_restaurant(res_id:string) {
		this.navCtrl.push(MoreInfo, { res_id });
	}

	rate(rating_id:number, res_id:string, liked:boolean) {
		let alert = this.alertCtrl.create({
			title: 'Why did you ' + (liked? '': 'not ') + 'like it?',
			inputs: [
			{
				type: 'checkbox',
				label: 'Food',
				value: 'food',
				checked: false
			},			{
				type: 'checkbox',
				label: 'Environent',
				value: 'environment',
				checked: false
			},			{
				type: 'checkbox',
				label: 'Price',
				value: 'price',
				checked: false
			},			{
				type: 'checkbox',
				label: 'Other',
				value: 'other',
				checked: false
			}],
			buttons: [{
				text: 'OK',
			}],
			enableBackdropDismiss: true
		});
		alert.present();
		alert.onDidDismiss((items: Array<string>) => {
			this.share(rating_id, res_id, liked, items);
		});
	}

	share(rating_id:number, res_id:string, liked:boolean, items: Array<string>) {
		if (!liked) return this.save_rating(rating_id, res_id, liked, items, false);

		let confirm = this.alertCtrl.create({
			title: 'Would you like to recommend this to your friends?',
			// message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
			buttons: [
			{
				text: 'Nah',
				handler: () => {
					 this.save_rating(rating_id, res_id, liked, items, false);
				}
			}, 
			{
				text: 'Yes!',
				handler: () => {
					 this.save_rating(rating_id, res_id, liked, items, true);
				}
			}], 
			enableBackdropDismiss: false
		});
		confirm.present();
	}


	save_rating(rating_id: number, res_id:string, liked: boolean, specifics: Array<string>, share:boolean) {
		this.munchrApi.rating(this.user.user_id, rating_id, res_id, liked, specifics.join('|'), share)
		.then(() =>{
			this.get_history();
		}, error => {});
	}

	dismiss_rating(rating_id:number) {
		this.munchrApi.dismiss_rating(rating_id)
		.then(() => {
			// change to splice
			this.get_history();
		});
	}
}
