import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Filter } from '../filter/filter';
import { MunchrApi } from "../../providers/munchr-api";

@Component({
	selector: 'page-main',
	templateUrl: 'main.html',
	providers: [ MunchrApi ],
})
export class Main {
	distance: number = 5;
	price: number = 2;
	categories: Array<string> = ['Breakfast', 'Lunch', 'Dinner', 'Dine-out', 'Delivery', 'Pubs & Bars'];
	cuisines: Array<string> = [];
	marked: Object = {};
	lat: number = 0;
	long: number = 0;
	loading: boolean = true;


	constructor(public navCtrl: NavController, public munchrApi: MunchrApi) {

		this.munchrApi.filters(this.lat, this.long)
			.then( data => {
				this.cuisines = data.results;
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
			lat: this.lat,
			long: this.long,
			price: this.price,
			distance: this.distance,
			categories: this.categories.filter((item) => {
				return this.marked[item];
			}),
			cuisines: this.cuisines
		},  {
			animation: 'ios-transition'
		});
	}
}
