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
	all: {categories: Array<{name:string, checked:boolean}>, cuisines: Array<{name:string, checked:boolean}> };
	items: {categories: Array<{name:string, checked:boolean}>, cuisines: Array<{name:string, checked:boolean}> };
	lat: number;
	long: number;

	constructor(public navCtrl: NavController, public navParams: NavParams, public munchrApi: MunchrApi) {
		this.initialize_values();
	}

	initialize_values() {
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
			this.all = {
				categories: categories,
				cuisines: cuisines
			}

			this.items = this.all;
		});

	}

	getItems(ev) {
		// Reset items back to all of the items
		// This is modifying the all list somehow :(
		// this.items = this.all;

		// set val to the value of the ev target
		var val = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.items.categories = this.all.categories.filter((item) => {
				return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
			})
			this.items.cuisines = this.all.cuisines.filter((item) => {
				return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
			})
		}
	}

	search() {
		this.navCtrl.push(Display);
	}
}
