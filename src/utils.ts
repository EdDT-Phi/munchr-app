import { Injectable } from '@angular/core';
import { ToastController } from "ionic-angular";

@Injectable()
export class Utils {

	constructor(
		public toastCtrl: ToastController
	) {}

	display_error(error: string) {
		console.log(error);
		let toast = this.toastCtrl.create({
			message: error,
			duration: 3000
		});
		toast.present();
	}
}
