import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-filter',
	templateUrl: 'filter.html'
})


export class Filter {
	all: Array<{name:string, checked:boolean}>;
	items: Array<{name:string, checked:boolean}>;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.initialize_values();
	}

	initialize_values() {
		let values = ['One', 'Two', 'Three'];
		this.all = [];
		for (let i = 0; i < values.length; i++) {
			this.all.push({name: values[i], checked:false});
		}
		this.items = this.all;
		console.log(this.items);
	}

	getItems(ev) {
		// Reset items back to all of the items

		// set val to the value of the ev target
		var val = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.items = this.all.filter((item) => {
				console.log(item);
				console.log(item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
				return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
			})
		}

		console.log(this.items);
		console.log(this.all);
	}
}
