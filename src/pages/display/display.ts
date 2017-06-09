import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { MunchrApi } from '../../providers/munchr-api';
import { UserService } from '../../providers/user-service';
import { MoreInfo } from '../info/info';

import { Utils } from "../../utils";

import {
  StackConfig,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';

@Component({
	selector: 'page-display',
	templateUrl: 'display.html',
	providers: [ MunchrApi, UserService ],
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
	limit: number = 10;
	offset: number = 0;
	user: {
		user_id: number,
		first_name: string, 
		last_name: string, 
		photo_url: string
	};
	location: {
		lat: number,
		lon: number,
	};

	constructor(
		private utils: Utils,
		private navParams: NavParams,
		private munchrApi: MunchrApi, 
		private userService: UserService,
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

		this.userService.get_user()
		.then(user => {
			this.user = user;
			this.add_cards();
		}, error => { });
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
		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		this.display_options = false;

		console.log('getting geolocation');
		Geolocation.getCurrentPosition()
		.then( resp => {
			this.location = {
				lat: resp.coords.latitude,
				lon: resp.coords.longitude,
			};
			console.log('have positiion, sending request');
			this.munchrApi.restaurants(
				resp.coords.latitude,
				resp.coords.longitude,
				this.navParams.get("radius"),
				this.limit,
				this.offset,
				this.navParams.get("price"),
				this.user.user_id,
				this.navParams.get("cuisines") )
			.then( (data) => {
				if(data.error) {
					this.utils.display_error(data.error);
				} else {
					this.cards = data.results;
					this.all_cards = this.cards.slice();
					this.offset += this.limit;
				}
				loading.dismiss();
				this.utils.show_tutorial('Hey! This is where we narrow down your decision. Swipe restaurants left if you\'re not feeling them, and swipe right if you do. Tap \'Take Me Here\' if you\'ve made your choise');
			});
		}).catch((error) => {
			this.utils.display_error_obj('Error getting location: ' + error.message, error);
		});
	}
	 
	info(res_id: string) {
		this.navCtrl.push(MoreInfo, { res_id });
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
	}

	start_over() {
		this.display_options = false;
		this.cards = this.all_cards.slice();
		this.liked_cards = [];
	}

	star_res() {
		const res = this.cards[this.cards.length-1];
		if (!res.starred) {
			this.munchrApi.star_res(this.user.user_id, res.res_id)
			.then(() => {
				res.starred = true;
			}, error => {});
		} else {
			this.munchrApi.unstar_res(this.user.user_id, res.res_id)
			.then(() => {
				res.starred = false;
			}, error => {});
		}
	}
}
