import { Component } from '@angular/core';

import { Events, NavController, ModalController, AlertController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { Login } from '../login/login';
import { Filter } from '../filter/filter';
import { Account } from '../account/account';
import { MoreInfo } from '../info/info';
import { Final } from '../final/final';
import { Display } from '../display/display';
import { MunchrApi } from '../../providers/munchr-api';

import { Utils } from '../../utils'

@Component({
	selector: 'page-main',
	templateUrl: 'main.html',
	providers: [ MunchrApi ],
})
export class Main {
	distance: number = 5;
	cuisines: Array<string> = [];
	loading: boolean = true;
	user: any;
	selection: string = 'newCuisine';
	activity: Array<any> = [];


	constructor(
		public navCtrl: NavController,
		public munchrApi: MunchrApi,
		public modalCtrl: ModalController,
		public alertCtrl: AlertController,
		public utils: Utils,
		public events: Events,
	) {

		NativeStorage.getItem('user')
		.then( data => {
			this.user = data;
			this.get_activity();
			this.broadcast_login();
			NativeStorage.getItem('last_time')
			.then( (time: number) => {
				// Three hours later
				// if (Math.floor(Date.now() / (1000 * 60)) > time +) {
					this.queryRestaurant();
				// }
			}, error => {
				// No restaurants to review
			});

		}, error => {
			// Not logged in
			this.get_user();
			// this.user={user_id:3}; // for testing
		});


		this.munchrApi.filters()
		.then( data => {
			console.log('got cuisines: ', data);

			if(data.error) {
				this.utils.display_error(data.error);
			} else {
				this.cuisines = data.results;
			}
			this.loading = false;
		});
	}

	search() {
		let d = this.distance;
		d = (d*d*d/320) + (320 - (d*d*d)%320)/320;
		if (this.selection === 'newRestaurant') {
			this.navCtrl.push(Display, {
				radius: d,
				user_id: this.user.user_id,
				cuisines: [],
			});
		} else {
			this.navCtrl.push(Filter, {
				distance: d,
				cuisines: this.cuisines,
				user_id: this.user.user_id,
				selection: this.selection,
			},  {
				animation: 'ios-transition'
			});
		}

	}

	get_user() {
		let modal = this.modalCtrl.create(Login);
		modal.present();
		modal.onDidDismiss(data => {
			if (!data){
				return this.get_user();
			}
			this.user = data;
			console.log(this.user);
			this.get_activity();
			this.broadcast_login();
		});
	}

	queryRestaurant() {
		NativeStorage.getItem('last_restaurant')
		.then( (restaurant: any) => {
			let confirm = this.alertCtrl.create({
				title: 'Did you like ' + restaurant.name +'?',
				// message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
				buttons: [
				{
					text: 'Nah',
					handler: () => {
						this.query_specifics(false);
					}
				}, 
				{
					text: 'Yes!',
					handler: () => {
						this.query_specifics(true);
					}
				}], 
				enableBackdropDismiss: false
			});
			confirm.present();

		}, error => {
			this.utils.display_error(error);
		});
	}

	query_specifics(liked: boolean) {
		NativeStorage.remove('last_restaurant')
		.then(success => {
			NativeStorage.remove('last_time');
			let alert = this.alertCtrl.create(
			{
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
					text: 'Cancel',
					handler: () => {
						// this.query_specifics(false);
					}
				}, {
					text: 'OK',
					handler: () => {
						// this.query_specifics(true);
					}
				}],
				enableBackdropDismiss: true
			});

			alert.present();
		}, error => {
			this.utils.display_error(error);
		})
	}

	get_activity() {
		this.munchrApi.friends_activity(this.user.user_id)
		.then(data => {
			console.log('got activity', data)
			if(data.error) {
				this.utils.display_error(data.error);
			} else {
				this.activity = data.results;
			}
			this.loading = false;
		});
	}

	broadcast_login() {
		this.events.publish('user:login', this.user);
	}

	view_account(rating:any) {
		this.navCtrl.push(Account, { user: rating });
	}

	view_restaurant(res_id:string) {
		const modal = this.modalCtrl.create(MoreInfo, { res_id });
		modal.present();
		modal.onDidDismiss(details => {
			if (details) {
				this.navCtrl.push(Final, {restaurant: details})
			}
		});
	}

	viewDidEnter() {
		this.get_activity();
	}
}
