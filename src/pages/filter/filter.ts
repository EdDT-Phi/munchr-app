import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Display } from '../display/display';

@Component({
	selector: 'page-filter',
	templateUrl: 'filter.html',
})


export class Filter {
	items: Array<string> = [];
	all: Array<string> = [];
	marked: Object = {};
	showSearch: boolean = true;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		const selection = navParams.get('selection');
		this.all = navParams.get('cuisines');
		
		if (selection === 'newRestaurant') {
			this.search();
		} else if (selection === 'newCuisine') {
			this.showSearch = false;
			this.marked[this.all[Math.floor(Math.random()*this.all.length)]] = true;
			let temp = [];
			while (temp.length < 5) {
				const chosen = Math.floor(Math.random() * this.all.length);
				if (temp.indexOf(this.all[chosen]) === -1) {
					temp.push(this.all[chosen]);
				}
			}
			this.all = temp;

		}

		this.items = this.all;
	}

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
			lat: this.navParams.get('lat'),
			long: this.navParams.get('long'),
			price: this.navParams.get('price'),
			radius: this.navParams.get('distance'),
			user_id: this.navParams.get('user_id'),
			categories: this.navParams.get('categories'),
			cuisines: this.items.filter((item) => {
				return this.marked[item];
			}),
		});
	}
}
