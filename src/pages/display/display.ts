import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-display',
	templateUrl: 'display.html'
})


export class Display {
	cards: any;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.cards = ['https://imgs.xkcd.com/comics/emails.png']
	}
}
