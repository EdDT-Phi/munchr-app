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
	items: {categories: Array<{name:string, checked:boolean}>, cuisines: Array<{name:string, checked:boolean}> };
	lat: number;
	long: number;

	constructor(public navCtrl: NavController, public navParams: NavParams, public munchrApi: MunchrApi) {
		this.initialize_values(null);
	}

	initialize_values(ev) {
		this.munchrApi.filters(this.lat, this.long)
		.then( data => {
			let values = data.results;
			let categories = [];
			let cuisines = [];

			for (let i = 0; i < values.categories.length; i++) {
				categories.push({name: values.categories[i], checked:false});
			}
			for (let i = 0; i < values.cuisines.length; i++) {
				cuisines.push({name: values.cuisines[i], checked:false});
			}
			this.items = {
				categories: categories,
				cuisines: cuisines
			}

			this.show_items(ev);
		});
	}

	getItems(ev) {
		// Reset items back to all of the items
		// This is modifying the all list somehow :(
		// this.items.categories = this.all.categories.slice();
		// this.items.cuisines = this.all.cuisines.slice();
		this.initialize_values(ev);
	}

	show_items(ev) {
		if(ev == null)
			return ;

		// set val to the value of the ev target
		var val = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.items.categories = this.items.categories.filter((item) => {
				return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
			})
			this.items.cuisines = this.items.cuisines.filter((item) => {
				return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
			})
		}
	}

	search() {

		this.navCtrl.push(Display, {
			price: this.navParams.get('price'),
			radius: this.navParams.get('distance'),
			categories: this.items.categories.filter((item) => {
				return item.checked;
			}).map(item => {
				return item.name;
			}),
			cuisines: this.items.cuisines.filter((item) => {
				return item.checked;
			}).map(item => {
				return item.name;
			}),
		});
	}
}
