import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {Login} from '../pages/login/login';
import {Main} from '../pages/main/main';
import {Create} from '../pages/create/create';
import {Filter} from '../pages/filter/filter';
import {Display} from '../pages/display/display';
import {MoreInfo} from '../pages/info/info';
import {Final} from '../pages/final/final';
import {Utils} from "../utils";

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
		Final,
		SwingCardComponent,
		SwingStackComponent,
	],
	imports: [
		IonicModule.forRoot(MyApp)
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
		Final,
	],
	providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Utils]
})
export class AppModule {
}
