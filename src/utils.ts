import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

@Injectable()
export class Utils {

	constructor(
		private toastCtrl: ToastController,
		private alertCtrl: AlertController,
	) {}

	display_error(error: string) {
		this.display_error_obj(error, error);
	}

	display_error_obj(error: string, err_obj: Object) {
		console.log(err_obj);
		let toast = this.toastCtrl.create({
			message: error,
			duration: 3000
		});
		toast.present();
	}

	show_tutorial(id: string, message: string) {
		NativeStorage.getItem('show_tutorial' + id)
		.then(show => {

		}, error => {
			let confirm = this.alertCtrl.create({
				title: 'Tutorial',
				message,
				inputs: [{
					type: 'checkbox',
					label: 'Do not show again',
					value: 'dismiss',
				}],
				buttons: ['OK'], 
			});
			confirm.present();
			confirm.onDidDismiss(info => {
				if (info.length > 0) {
					NativeStorage.setItem('show_tutorial' + id, true)
					.then(() => {}, error => {});
				}
			});
		});
	}
}
