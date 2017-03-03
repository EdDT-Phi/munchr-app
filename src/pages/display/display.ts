import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';

import { NavController, NavParams, ModalController, Loading, LoadingController } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';
import { MoreInfo } from '../info/info';
import { Final } from '../final/final';

import {Utils} from "../../utils";

import {
  StackConfig,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';

@Component({
	selector: 'page-display',
	templateUrl: 'display.html',
	providers: [ MunchrApi ],
	entryComponents: [SwingStackComponent, SwingCardComponent]
})


export class Display {
	@ViewChild('myswing1') swingStack: SwingStackComponent;
  	@ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

	cards: Array<Object> = [];
	liked_cards: Array<Object> = [];
	stackConfig: StackConfig;
	display_options: boolean = false;
	like_opacity: number = 0;
	unlike_opacity: number = 0;
	limit: number = 10;
	offset: number = 0;
	loading: Loading;

	constructor(
		public munchrApi: MunchrApi, 
		public navCtrl: NavController, 
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public loadingCtrl: LoadingController,
		public utils: Utils,
	) {

		this.add_cards();

		// TODO implemnent up throw
		this.stackConfig = {
			throwOutConfidence: (offset, element) => {
				return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
			},
			throwOutDistance: () => {
				return 800;
			}
		};
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

		let args = {
			lat: this.navParams.get("lat"),
			long: this.navParams.get("long"),
			radius: this.navParams.get("radius"),
			categories: this.navParams.get("categories"),
			cuisines: this.navParams.get("cuisines"),
			price: this.navParams.get("price"),
			user_id: 0,
			offset: this.offset,
			limit: this.limit
		};

		this.munchrApi.restaurants(args)
		.then( (data) => {
			if(data.error) {
				this.utils.display_error(data);
			} else {
				this.cards = data.results;
				this.offset += this.limit;
			}
			this.loading.dismiss();
		});
	}
	 
	info(restaurant: Object) {
		let modal = this.modalCtrl.create(MoreInfo, restaurant);
		modal.present();
	}

	// TODO implement up throw
	throw_out(direction: number) {
		const card = this.cards.pop();
		if (direction == 1) {
			this.liked_cards.push(card);
		}

		if (this.cards.length == 0) {
			this.display_options = true;
		}
	}

	see_liked() {
		this.display_options = false;
		this.cards = this.liked_cards;
		this.liked_cards = [];
	}

	choose() {
		this.navCtrl.push(Final, {
			restaurant: this.cards.pop()
		})
	}

	start_over() {
		this.navCtrl.pop();
	}
}
