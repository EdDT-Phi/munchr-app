import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, NativeStorage, ScreenOrientation } from 'ionic-native';

import { Main } from '../pages/main/main';

import { Utils } from '../utils';


@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = Main;

	pages: Array<{title: string, component: any}>;

	constructor(public platform: Platform, public utils: Utils) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: Main },
			{ title: 'Profile', component: Main },
			{ title: 'Logout', component: Main }
		];

		ScreenOrientation.lockOrientation('portrait')
		.then(succes => {}, error => this.utils.display_error_obj('Error setting screen orientation lock', error));


	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			StatusBar.styleDefault();
			Splashscreen.hide();
		});
	}

	openPage(page) {
		if(page.title == 'Logout') {
		 	NativeStorage.remove("user")
			.then(()=>{}, (error)=> {
				// this.utils.display_error(error);
			});
		}

		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}
}
