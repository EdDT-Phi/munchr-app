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

	display_error_obj(error: string, err_obj: Object) {
		console.log(err_obj);
		let toast = this.toastCtrl.create({
			message: error,
			duration: 3000
		});
		toast.present();
	}
}
