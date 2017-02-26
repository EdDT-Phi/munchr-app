import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Filter } from '../filter/filter';

@Component({
	selector: 'page-main',
	templateUrl: 'main.html'
})
export class Main {
	icons: string[];
	distance: number;
	price: number;
	categories: Array<string>;
	marked: Object;


	constructor(public navCtrl: NavController, public navParams: NavParams) {

		this.distance = 5;
		this.categories = ['Breakfast', 'Lunch', 'Dinner', 'Dine-out', 'Delivery', 'Pubs & Bars'];
		this.marked = {};

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
			})
		});
	}
}
