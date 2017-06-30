import { Injectable } from '@angular/core';
import { Geolocation } from 'ionic-native';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationProvider {

	lat: number;
	lng: number;

	constructor() {
		this.cache_current_location();
		setInterval(this.cache_current_location, 1000 * 60 * 5); // 5 minutes
	}

	cache_current_location() {
		Geolocation.getCurrentPosition()
		.then( resp => {
			this.lat = resp.coords.latitude;
			this.lng = resp.coords.longitude;
		}).catch((error) => {
			console.log('failed to get position... retrying');
			return this.cache_current_location();
		});
	}

	get_user_position(): {lat: number, lng: number} {
		return { lat: this.lat, lng: this.lng };
	}
}
