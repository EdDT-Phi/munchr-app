import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ModalController, AlertController } from 'ionic-angular';

import { Account } from '../account/account'; 
import { MoreInfo } from '../info/info'; 
import { MunchrApi } from '../../providers/munchr-api';


@Component({
	selector: 'page-notifications',
	templateUrl: 'notifications.html',
})
export class Notifications {

	requests: Array<any>;
	recommendations: Array<any>;
	ratings: Array<any>;
	loading: Loading = null;

	constructor(
		private navParams: NavParams,
		private munchrApi: MunchrApi,
		private navCtrl: NavController,
		private alertCtrl: AlertController,
		private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
	) {

		const notifications = navParams.get('notifications');
		if (notifications) {
			this.requests = notifications.requests;
			this.recommendations = notifications.recommendations;
			this.ratings = notifications.ratings;
		} else {
			this.get_notifications();
		}
	}

	get_notifications() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		this.munchrApi.notifications()
		.then(data => {
			this.requests = data.results.requests;
			this.recommendations = data.results.recommendations;
			this.ratings = data.results.ratings;
			this.loading.dismiss();
		}, error => { });
	}

	view_account(user:any) {
		const modal = this.modalCtrl.create(Account, { user });
		modal.present();
		modal.onDidDismiss(()=> {
			this.get_notifications();
		});
	}

	view_restaurant(res_id: string) {
		this.navCtrl.push(MoreInfo, { res_id });
	}

	respond(response:boolean, oth_user:any) {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present()
		this.munchrApi.respond_request(response, oth_user.user_id)
		.then(data => {
			console.log(data);
			this.requests = data.result.requests;
			this.loading.dismiss();
			this.loading = null;
		}, error => {});
	}

	dismiss(index: number) {
		const recomm = this.recommendations.splice(index, 1)[0];
		this.munchrApi.dismiss_recommendation(recomm.user_id, recomm.res_id)
		.then(() => {}, error => {})
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
		this.munchrApi.rating(rating_id, res_id, liked, specifics.join('|'), share)
		.then(() =>{
			this.get_notifications();
		}, error => {});
	}

	dismiss_rating(rating_id:number, index:number) {
		this.ratings.splice(index, 1);
		this.munchrApi.dismiss_rating(rating_id)
		.then(() => {
			// change to splice
			// this.get_notifications();
		});
	}
}
