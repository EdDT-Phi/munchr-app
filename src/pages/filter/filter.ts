import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Display } from '../display/display';

import { MunchrApi } from '../../providers/munchr-api';

@Component({
	selector: 'page-filter',
	templateUrl: 'filter.html',
	providers: [ MunchrApi ]
})


export class Filter {
	items: Array<string>;
	all: Array<string>;
	marked: Object;
	lat: number;
	long: number;

	constructor(public navCtrl: NavController, public navParams: NavParams, public munchrApi: MunchrApi) {
		this.initialize_values(null);
		this.marked = {};
	}

	initialize_values(ev) {
		this.munchrApi.filters(this.lat, this.long)
		.then( data => {
			this.items = data.results;
			this.all = data.results;
		});
	}

	// getItems(ev) {
	// 	// Reset items back to all of the items
	// 	// This is modifying the all list somehow :(
	// 	// this.items.categories = this.all.categories.slice();
	// 	// this.items.cuisines = this.all.cuisines.slice();
	// 	this.initialize_values(ev);
	// }

	show_items(ev) {
		console.log(this.items);
		if(ev == null)
			return ;

		// set val to the value of the ev target
		var val = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.items = this.all.filter((item) => {
				return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
			});
		} else {
			this.items = this.all;
		}
	}

	search() {

		this.navCtrl.push(Display, {
			price: this.navParams.get('price'),
			radius: this.navParams.get('distance'),
			categories: this.navParams.get('categories'),
			cuisines: this.items.filter((item) => {
				return this.marked[item];
			}),
		});
	}
}
