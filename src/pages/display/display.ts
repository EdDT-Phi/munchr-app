import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';

import { NavController, NavParams, ModalController } from 'ionic-angular';

import { MunchrApi } from '../../providers/munchr-api';
import { MoreInfo } from '../info/info';

import {
  StackConfig,
  // Stack,
  // Card,
  ThrowEvent,
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
	
	cards: Array<Object>;
	stackConfig: StackConfig;
	like_opacity: number;
	unlike_opacity: number;

	constructor(
		public munchrApi: MunchrApi, 
		public navCtrl: NavController, 
		public navParams: NavParams,
		public modalCtrl: ModalController
	) {
		this.add_cards();

		this.stackConfig = {
			throwOutConfidence: (offset, element) => {
				return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
			},
			// transform: (element, x, y, r) => {
			// 	this.onItemMove(element, x, y, r);
			// },
			throwOutDistance: (d) => {
				return 800;
			}
		};
		this.like_opacity = 0;
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

		this.swingStack.dragend.subscribe((event: DragEvent) => {
			this.like_opacity = 0;
			this.unlike_opacity = 0;
		});
	}
	 
	// Add new cards to our array
	add_cards() {
		let args = {
			lat: 0,
			long: 0,
			radius: this.navParams.get("radius"),
			categories: this.navParams.get("categories"),
			cuisines: this.navParams.get("cuisines"),
			price: this.navParams.get("price"),
			user_id: 0
		}

		this.munchrApi.restaurants(args)
		.then( data => {
			this.cards = data.results
		});
	}
	 
	info(restaurant) {
		let modal = this.modalCtrl.create(MoreInfo, restaurant);
		modal.present();
	}

	throw_out(event: ThrowEvent) {
		console.log(event);
	}
	
}
