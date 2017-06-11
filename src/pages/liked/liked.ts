import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Liked page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-liked',
	templateUrl: 'liked.html'
})
export class Liked {

	restaurants: Array<any> = [];


	constructor(
		public navParams: NavParams,
		public navCtrl: NavController,
	) {
		this.restaurants = this.navParams.get('restaurants');
	}
}
