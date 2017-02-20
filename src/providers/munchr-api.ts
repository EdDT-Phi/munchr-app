import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MunchrApiLogin provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MunchrApi {
	data: any;
	lat: number;
	long: number;

	constructor(public http: Http) {
		console.log('Hello MunchrApiLogin Provider');
	}

	filters(lat, long) {
		// check if lat long is similar
		if (this.data) {
			// already loaded data
			return Promise.resolve(this.data);
		}

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });
		let obj = {"lat": lat, "long": long}
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.post('https://munchr.herokuapp.com/restaurants/filters', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.data = data;
				resolve(this.data);
			});
		});
	}

	restaurants(lat, long, radius, ) {
		
	}
}
