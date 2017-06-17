import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { NativeStorage } from '@ionic-native/native-storage';


import { MyApp } from './app.component';
import { Login } from '../pages/login/login';
import { Main } from '../pages/main/main';
import { Create } from '../pages/create/create';
import { Filter } from '../pages/filter/filter';
import { Display } from '../pages/display/display';
import { MoreInfo } from '../pages/info/info';
import { Account } from '../pages/account/account';
import { Friends } from '../pages/friends/friends';
import { Search } from '../pages/search/search';
import { Notifications } from '../pages/notifications/notifications';
import { Stars } from '../pages/stars/stars';
import { ResSearch } from '../pages/res_search/res_search';
import { History } from '../pages/history/history';
import { Liked } from '../pages/liked/liked';
import { Utils } from '../utils';
import { MunchrApi } from '../providers/munchr-api';
import { UserService } from '../providers/user-service';

import {
	SwingStackComponent,
	SwingCardComponent
} from 'angular2-swing';

@NgModule({
	declarations: [
		MyApp,
		Login,
		Main,
		Create,
		Filter,
		Display,
		MoreInfo,
		Account,
		SwingCardComponent,
		SwingStackComponent,
		Friends,
		Search,
		Notifications,
		Stars,
		ResSearch,
		History,
		Liked,
	],
	imports: [
		IonicModule.forRoot(MyApp),
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		Login,
		Main,
		Create,
		Filter,
		Display,
		MoreInfo,
		Account,
		Friends,
		Search,
		Notifications,
		Stars,
		ResSearch,
		History,
		Liked,
	],
	providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Utils, MunchrApi, UserService, NativeStorage]
})
export class AppModule {
}
