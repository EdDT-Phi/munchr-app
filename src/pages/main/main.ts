import { Component } from '@angular/core';
import { Events, NavController, ModalController, AlertController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { Login } from '../login/login';
import { Filter } from '../filter/filter';
import { Account } from '../account/account';
import { MoreInfo } from '../info/info';
import { Final } from '../final/final';
import { Display } from '../display/display';
import { Notifications } from '../notifications/notifications';
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
	notifications: {requests: Array<any>};


	constructor(
		private utils: Utils,
		private events: Events,
		private munchrApi: MunchrApi,
		private navCtrl: NavController,
		private modalCtrl: ModalController,
		private alertCtrl: AlertController,
	) {

		NativeStorage.getItem('user')
		.then( data => {
			this.user = data;
			this.after_get_user();

		}, error => {
			// Not logged in
			this.get_user();

			// this.user = {user_id: 3, first_name:'Tyler', last_name:'Camp', photo_url:''}
			// this.after_get_user();
		});


		this.munchrApi.filters()
		.then( data => {
			if(data.error) {
				this.utils.display_error(data.error);
			} else {
				this.cuisines = data.results;
			}
			this.loading = false;
		});
	}

	search() {
		let distance = this.distance;
		distance = (distance*distance*distance/320) + (320 - (distance*distance*distance)%320)/320;
		if (this.selection === 'newRestaurant') {
			this.navCtrl.push(Display, {
				radius: distance,
				user_id: this.user.user_id,
				cuisines: [],
			});
		} else {
			this.navCtrl.push(Filter, {
				distance,
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
			this.after_get_user();
		});
	}

	after_get_user(){
		this.get_activity();
		this.broadcast_login();
		this.get_notifications();

		// NativeStorage.getItem('last_time')
		// .then( (time: number) => {
			// Three hours later
			// if (Math.floor(Date.now() / (1000 * 60)) > time +) {
				this.queryRestaurant();
			// }
		// }, error => {
			// No restaurants to review
		// });
	}

	queryRestaurant() {
		NativeStorage.getItem('last_restaurant')
		.then( (restaurant: {name: string, res_id: string}) => {
			// const restaurant = {name: 'Restaurant name', res_id: 'ChIJ10x0ibC1RIYRD0WircgSxSM'}
			let confirm = this.alertCtrl.create({
				title: 'Did you like ' + restaurant.name +'?',
				// message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
				buttons: [
				{
					text: 'Nah',
					handler: () => {
						this.query_specifics(false, restaurant);
					}
				}, 
				{
					text: 'Yes!',
					handler: () => {
						this.query_specifics(true, restaurant);
					}
				}], 
				enableBackdropDismiss: false
			});
			confirm.present();

		}, error => {
			this.utils.display_error(error);
		});
	}

	query_specifics(liked: boolean, restaurant: {name: string, res_id: string}) {
		NativeStorage.remove('last_restaurant')
		.then(success => {
			NativeStorage.remove('last_time');
			if (!restaurant)
				return;
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
					text: 'OK',
				}],
				enableBackdropDismiss: true
			});

			alert.present();
			alert.onDidDismiss((items: Array<string>) => {
				this.save_rating(restaurant.res_id, liked, items);
			});
		}, error => {
			this.utils.display_error(error);
		})
	}

	save_rating(res_id: string, liked: boolean, specifics: Array<string>) {
		this.munchrApi.rating(this.user.user_id, res_id, liked, specifics.join('|'))
		.then(() =>{ }, error => {});
	}

	get_activity() {
		this.munchrApi.friends_activity(this.user.user_id)
		.then(data => {
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

	view_account(user:any) {
		this.navCtrl.push(Account, { user: user });
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

	viewDidEnter() {
		this.get_activity();
	}

	view_notifications() {
		this.navCtrl.push(Notifications, {notifications: this.notifications});
		this.notifications = null;
	}

	get_notifications() {
		this.munchrApi.notifications(this.user.user_id)
		.then(data => {
			this.notifications = data.results;
		}, error => { });
	}
}
