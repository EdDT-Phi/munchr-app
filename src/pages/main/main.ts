import { Component } from '@angular/core';

import { NavController, ModalController, AlertController } from 'ionic-angular';
import { Geolocation, NativeStorage } from 'ionic-native';

import { Filter } from '../filter/filter';
import { MunchrApi } from "../../providers/munchr-api";
import { Login } from "../login/login";

import { Utils } from "../../utils"

@Component({
	selector: 'page-main',
	templateUrl: 'main.html',
	providers: [ MunchrApi ],
})
export class Main {
	distance: number = 5;
	price: number = 2;
	categories: Array<string> = ['Breakfast', 'Lunch', 'Dinner', 'Dine-out', 'Delivery', 'Pubs %26 Bars'];
	cuisines: Array<string> = [];
	marked: Object = {};
	loading: boolean = true;
	user: any;
	selection: string = 'newCuisine';


	constructor(
		public navCtrl: NavController,
		public munchrApi: MunchrApi,
		public modalCtrl: ModalController,
		public alertCtrl: AlertController,
		public utils: Utils,
	) {

		NativeStorage.getItem('user')
		.then( data => {
			this.user = data;

			NativeStorage.getItem('last_time')
			.then( (time: number) => {
				// Three hours later
				if (Math.floor(Date.now() / (1000 * 60)) > time + 60*3) {
					this.queryRestaurant();
				}
			}, error => {
				// No restaurants to review
				// this.utils.display_error(error);
			});

		}, error => {
			// Not logged in
			// this.utils.display_error(error);
			// this.get_user();
			this.user={user_id:1}
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

		const time = new Date().getHours();
		if(time <= 10)
			this.marked['Breakfast'] = true;
		else if (time <= 16)
			this.marked['Lunch'] = true;
		else
			this.marked['Dinner'] = true;
	}

	search() {
		this.navCtrl.push(Filter, {
			price: this.price,
			distance: this.distance,
			categories: this.categories.filter((item) => {
				return this.marked[item];
			}),
			cuisines: this.cuisines,
			user_id: this.user.user_id,
			selection: this.selection,
		},  {
			animation: 'ios-transition'
		});
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
}
