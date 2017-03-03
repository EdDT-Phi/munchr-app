import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Display } from '../display/display';

@Component({
	selector: 'page-filter',
	templateUrl: 'filter.html',
})


export class Filter {
	items: Array<string>;
	all: Array<string>;
	marked: Object;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.all = navParams.get('cuisines');
		this.items = navParams.get('cuisines');
		this.marked = {};
		this.marked[this.all[Math.floor(Math.random()*this.all.length)]] = true;
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
			categories: this.navParams.get('categories'),
			cuisines: this.items.filter((item) => {
				return this.marked[item];
			}),
		});
	}
}
