import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Display } from '../display/display';

@Component({
	selector: 'page-filter',
	templateUrl: 'filter.html',
})


export class Filter {
	items: Array<string> = [];
	recommended: Array<string> = [];
	all: Array<string> = [];
	all_recommended: Array<string> = [];
	marked: Object = {};
	distance: number = 8;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.all = navParams.get('cuisines');

		while (this.all_recommended.length < 5) {
			const chosen = Math.floor(Math.random() * this.all.length);
			if (this.all_recommended.indexOf(this.all[chosen]) === -1) {
				this.all_recommended.push(this.all[chosen]);
			}
		}

		this.items = this.all;
		this.recommended = this.all_recommended;
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
			this.recommended = this.all_recommended.filter((item) => {
				return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
			});
		} else {
			this.items = this.all;
			this.recommended = this.all_recommended;
		}
	}

	search() {
		const distance = this.distance;
		this.navCtrl.push(Display, {
			radius: (distance*distance*distance/320) + (320 - (distance*distance*distance)%320)/320,
			cuisines: this.items.filter((item) => {
				return this.marked[item];
			}),
		});
	}
}
