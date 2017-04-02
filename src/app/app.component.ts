import { Component, ViewChild } from '@angular/core';

import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, NativeStorage, ScreenOrientation } from 'ionic-native';

import { Main } from '../pages/main/main';
import { Account } from '../pages/account/account';
import { Friends } from '../pages/friends/friends';
import { Utils } from '../utils';


@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: Component = Main;
	pages: Array<{title: string, component: Component}>;
	user: any = {};
	account_page: {title: string, component: Component};


	constructor(
		private platform: Platform, 
		private utils: Utils,
		private events: Events,
	) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: Main },
			{ title: 'Friends', component: Friends },
			{ title: 'Logout', component: Main }
		];

		this.account_page = {title: 'Account', component: Account};
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			StatusBar.styleDefault();
			Splashscreen.hide();
			ScreenOrientation.lockOrientation('portrait')
			.then(succes => {}, error => this.utils.display_error_obj('Error setting screen orientation lock', error));
			this.events.subscribe('user:login', (user) => {
				this.user = user;
			});
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
