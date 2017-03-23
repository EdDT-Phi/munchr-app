import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';

import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';

import { AdMob, Geolocation } from 'ionic-native';


import { MunchrApi } from '../../providers/munchr-api';
import { MoreInfo } from '../info/info';
import { Final } from '../final/final';

import { Utils } from "../../utils";

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

	ionViewDidLoad() {
		AdMob.onAdDismiss()
		.subscribe(() => console.log('User dismissed ad'));
		AdMob.prepareInterstitial('ca-app-pub-8261731470611823/8785759392')
		.then(() => AdMob.showInterstitial(),
			error => this.utils.display_error(error));
	}
	 
	// Add new cards to our array
	add_cards() {
		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		this.display_options = false;

		Geolocation.getCurrentPosition()
		.then( resp => {

			this.munchrApi.restaurants(
				resp.coords.latitude,
				resp.coords.longitude,
				this.navParams.get("radius"),
				this.limit,
				this.offset,
				this.navParams.get("price"),
				this.navParams.get("user_id"),
				this.navParams.get("cuisines"),
				this.navParams.get("categories") )
			.then( (data) => {
				if(data.error) {
					this.utils.display_error(data.error);
				} else {
					this.cards = data.results;
					this.offset += this.limit;
				}
				loading.dismiss();
			});
		}).catch((error) => {
			this.utils.display_error_obj('Error getting location: ' + error.message, error);
		});
	}
	 
	info(restaurant: Object) {
		let modal = this.modalCtrl.create(MoreInfo, restaurant);
		modal.present();
		modal.onDidDismiss(chosen => {
			if (chosen){
				this.choose();
			}
		});
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
			restaurant: this.cards[this.cards.length-1]
		})
	}

	start_over() {
		this.navCtrl.pop();
	}
}
