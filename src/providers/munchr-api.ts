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
	restaurants_data: any;
	reviews_data: any;
	filters_data: any;
	photos_data: any;
	lat: number;
	long: number;
	url: string;

	constructor(public http: Http) {
		// console.log('Hello MunchrApiLogin Provider');
		this.url = 'http://localhost:5000'; //dev 
		// this.url = 'https://munchr-test.herokuapp.com'; //prod
	}

	filters(lat, long) {
		// check if lat long is similar
		if (this.filters_data) {
			// already loaded data
			return Promise.resolve(this.filters_data);
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

			this.http.post(this.url + '/restaurants/filters', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.filters_data = data;
				resolve(this.filters_data);
			});
		});
	}

	restaurants(args) {
		if (this.restaurants_data) {
			// already loaded data
			return Promise.resolve(this.restaurants_data);
		}

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });

		let obj = {
			"lat": args.lat,
			"long": args.long,
			"radius": args.radius,
			"categories": args.categories.join(","),
			"cuisines": args.cuisines.join(","),
			"price": args.price ? args.price : 2,
			"user_id": args.user_id,

		};
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.post(this.url + '/restaurants/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.restaurants_data = data;
				resolve(this.restaurants_data);
			});
		});	
	}

	reviews(res_id) {
		if (this.reviews_data) {
			// already loaded data
			return Promise.resolve(this.reviews_data);
		}

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(this.url + '/restaurants/reviews/' + res_id)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.reviews_data = data;
				resolve(this.reviews_data);
			});
		});	
	}

	photos(restaurant) {
		if (this.photos_data) {
			// already loaded data
			return Promise.resolve(this.photos_data);
		}

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.
			let address = restaurant.location.address.split(',');
			address = address[address.length-2];

			let query = restaurant.name  + ' ' + restaurant.location.locality
			+ ' ' + restaurant.cuisines +' restaurant' + ' ' + address;

			this.http.get(this.url + '/restaurants/photos/' + query)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.photos_data = data;
				resolve(this.photos_data);
			});
		});	
	}
}
