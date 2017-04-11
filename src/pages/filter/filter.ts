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
	title: string = 'What are you in the mood for?';

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		const selection = navParams.get('selection');
		this.all = navParams.get('cuisines');
		
		if (selection === 'newRestaurant') {
			this.search();
		} else if (selection === 'newCuisine') {
			this.title = 'You might like these cuisines';
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
			radius: this.navParams.get('distance'),
			user_id: this.navParams.get('user_id'),
			cuisines: this.items.filter((item) => {
				return this.marked[item];
			}),
		});
	}
}
