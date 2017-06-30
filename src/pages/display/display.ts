import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Loading } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';
import { LocationProvider } from '../../providers/location';

import { MoreInfo } from '../info/info';

import { Utils } from "../../utils";


@Component({
	selector: 'page-display',
	templateUrl: 'display.html',
})


export class Display {

	restaurants: Array<{
		res_id: string,
		name: string,
		phone: string,
		website: string,
		price:string,
		opennow: boolean,
		reviews: Array<any>,
		photos: Array<any>,
		rating: number,
		location: {
			lat: number,
			lng: number,
			distance: number,
			address: string,
		},
		starred: boolean,
	}> = [];

	original: Array<any>;

	loading: Loading = null;
	no_results:boolean = false;

	constructor(
		private utils: Utils,
		private munchrApi: MunchrApi, 
		private locationProvider: LocationProvider,
		private navParams: NavParams,
		private navCtrl: NavController, 
		private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
	) {

		this.add_cards();
	}

	 
	// Add new cards to our array
	add_cards() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();

		const location:{
			lat: number,
			lng: number,
		} = this.locationProvider.get_user_position();
		this.munchrApi.restaurants(
			location.lat,
			location.lng,
			this.navParams.get("radius"),
			this.navParams.get("cuisines") )
		.then( (data) => {
			if(data.error) {
				this.utils.display_error(data.error);
			} else {
				this.original = data.results;
				this.restaurants = this.original.slice();
				if (this.restaurants.length === 0) {
					this.no_results = true;
				}
			}
			this.loading.dismiss();
			this.loading = null;
			this.utils.show_tutorial('display_page', 'This is where we narrow down your decision. Swipe restaurants left to remove them and right to save it for later. Tap on the restaurant to view more information.');
		});
	}
	 
	info(res_id) {
		this.navCtrl.push(MoreInfo, { res_id });
	}

	star_res(index:number) {
		const res = this.restaurants[index];
		res.starred = !res.starred;
		if (!res.starred) {
			this.munchrApi.star_res(res.res_id)
			.then(() => {}, error => {});
		} else {
			this.munchrApi.unstar_res(res.res_id)
			.then(() => {}, error => {});
		}
	}

	throw_out(event, item, index, res_id) {
		if (Math.abs(event.getSlidingPercent()) === 1){
			item.close();
			return;
		}
		if (!this.restaurants[index] || this.restaurants[index].res_id != res_id) {
			return;
		}

		if (Math.abs(event.getSlidingPercent()) > 6) {
			this.restaurants.splice(index, 1);
		}
	}

	go_back() {
		this.navCtrl.pop();
	}

	start_over() {
		this.restaurants = this.original.slice();
	}
}
