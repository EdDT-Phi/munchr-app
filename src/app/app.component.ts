import { Component, ViewChild } from '@angular/core';

import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, NativeStorage, ScreenOrientation, Deeplinks } from 'ionic-native';

import { Main } from '../pages/main/main';
import { Account } from '../pages/account/account';
import { Friends } from '../pages/friends/friends';
import { Search } from '../pages/search/search';
import { MoreInfo } from '../pages/info/info';
import { Stars } from '../pages/stars/stars';
import { ResSearch } from '../pages/res_search/res_search';
import { History } from '../pages/history/history';
import { Utils } from '../utils';


@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: Component = Main;
	user: any = {};
	pages: Array<{title: string, component: Component, icon: string}>;
	account_page: {title: string, component: Component};


	constructor(
		private platform: Platform, 
		private utils: Utils,
		private events: Events,
	) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Munch History', component: History, icon: 'time' },
			{ title: 'Search Users', component: Search, icon: 'search' },
			{ title: 'Search Restaurants', component: ResSearch, icon: 'search' },
			{ title: 'Starred Restaurants', component: Stars, icon: 'star' },
			{ title: 'Friends', component: Friends, icon: 'people' },
			{ title: 'Logout', component: Main, icon:'exit' },
		];

		this.account_page = {title: 'Account', component: Account};

		this.events.subscribe('user:login', (user) => {
			this.user = user;
		});
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			StatusBar.styleDefault();
			Splashscreen.hide();
			Deeplinks.routeWithNavController(this.nav, {
				'/restaurant/:res_id': MoreInfo
			}).subscribe(match => {
				console.log('match:', match);
			}, nomatch => {
				console.log('nomatch:', nomatch);

			});
			ScreenOrientation.lockOrientation('portrait')
			.then(succes => {}, error => {});

		});
	}

	openPage(page) {
		if (page.title == 'Logout') {
		 	NativeStorage.remove("user")
			.then(()=>{}, (error)=> {
				// this.utils.display_error(error);
			});
		}

		if (page.component === Main) {
			this.nav.setRoot(Main);
		} else {
			// Reset the content nav to have just this page
			// we wouldn't want the back button to show in this scenario
			this.nav.push(page.component, {user: this.user});
		}

	}
}
