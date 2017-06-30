import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Loading } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';
import { LocationProvider } from '../../providers/location';
import { MoreInfo } from '../info/info';
// import { Liked } from '../liked/liked';

import { Utils } from "../../utils";

import {
  StackConfig,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';

@Component({
	selector: 'page-display',
	templateUrl: 'display.html',
	entryComponents: [SwingStackComponent, SwingCardComponent]
})


export class Display {
	@ViewChild('myswing1') swingStack: SwingStackComponent;
  	@ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

	cards: Array<any> = [];
	all_cards: Array<any> = [];
	liked_cards: Array<any> = [];
	stackConfig: StackConfig;
	display_options: boolean = false;
	like_opacity: number = 0;
	unlike_opacity: number = 0;
	location: {
		lat: number,
		lng: number,
	};
	loading: Loading = null;

	constructor(
		private utils: Utils,
		private munchrApi: MunchrApi, 
		private locationProvider: LocationProvider,
		private navParams: NavParams,
		private navCtrl: NavController, 
		private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
	) {
		this.stackConfig = {
			throwOutConfidence: (offset, element) => {
				return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
			},
			throwOutDistance: () => (800)
		};

		this.add_cards();
	}

	ngAfterViewInit() {
		this.swingStack.dragmove.subscribe((event: DragEvent) => {
			if(event.throwDirection == 1) {
				this.like_opacity = event.throwOutConfidence;
				this.unlike_opacity = 0;
			} else {
				this.unlike_opacity = event.throwOutConfidence;
				this.like_opacity = 0;
			}
		});

		this.swingStack.dragend.subscribe(() => {
			this.like_opacity = 0;
			this.unlike_opacity = 0;
		});
	}
	 
	// Add new cards to our array
	add_cards() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
		this.display_options = false;

		this.location = this.locationProvider.get_user_position();
		this.munchrApi.restaurants(
			this.location.lat,
			this.location.lng,
			this.navParams.get("radius"),
			this.navParams.get("cuisines") )
		.then( (data) => {
			if(data.error) {
				this.utils.display_error(data.error);
			} else {
				this.cards = data.results;
				this.all_cards = this.cards.slice();
			}
			this.loading.dismiss();
			this.loading = null;
			this.utils.show_tutorial('display_page', 'This is where we narrow down your decision. Swipe restaurants left to remove them and right to save it for later. Tap on the restaurant to view more information.');
		});
	}
	 
	info() {
		this.navCtrl.push(MoreInfo, { res_id: this.cards[this.cards.length - 1].res_id });
	}

	// TODO implement up throw
	throw_out(direction: number) {
		const card = this.cards.pop();
		if (direction == 1) {
			this.liked_cards.unshift(card);
		}

		if (this.cards.length == 0) {
			this.display_options = true;
		}
	}

	see_liked() {
		if (this.liked_cards.length > 0) {
			this.display_options = false;
			this.cards = this.liked_cards;
			this.liked_cards = [];
		}
		// this.navCtrl.push(Liked, { restaurants: this.liked_cards })
	}

	start_over() {
		this.display_options = false;
		this.cards = this.all_cards.slice();
		this.liked_cards = [];
	}

	star_res() {
		const res = this.cards[this.cards.length-1];
		if (!res.starred) {
			this.munchrApi.star_res(res.res_id)
			.then(() => {
				res.starred = true;
			}, error => {});
		} else {
			this.munchrApi.unstar_res(res.res_id)
			.then(() => {
				res.starred = false;
			}, error => {});
		}
	}

	go_back() {
		this.navCtrl.pop();
	}
}
