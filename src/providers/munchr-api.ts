import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


function round_7(num: number) {
	return Math.floor(num * 10000000) * 10000000;
}

function are_similar(lat1: number, long1: number, lat2: number, long2: number) {
	return round_7(lat1) == round_7(lat2) && round_7(long1) == round_7(long2);
}

/*
  Generated class for the MunchrApiLogin provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MunchrApi {
	url: string;

	photos_data: any;
	reviews_data: any;
	filters_data: any;
	restaurants_data: any;
	
	lat: number;
	long: number;
	limit: number;
	offset: number;

	constructor(public http: Http) {
		// console.log('Hello MunchrApiLogin Provider');
		// this.url = 'http://localhost:5000'; // dev
		this.url = 'https://munchr-test.herokuapp.com'; // prod
		// this.url = 'https://munchr.herokuapp.com'; // prod
	}

	filters(lat: number, long: number) {
		if (this.filters_data) {
			// already loaded data
			return Promise.resolve(this.filters_data);
		}

		// this.lat = lat;
		// this.long = long;

		// let headers = new Headers();
		// headers.append('Content-Type', 'application/x-www-form-urlencoded');
		// let options = new RequestOptions({ headers: headers });
		// let obj = {"lat": lat, "long": long}
		// let data = Object.keys(obj).map(function(key) {
		//     return key + '=' + obj[key];
		// }).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(this.url + '/restaurants/filters')
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.filters_data = data;
				resolve(this.filters_data);
			}, error => {
				this.filters_data = {error: JSON.parse(error._body).error};
				resolve(this.filters_data);
			});
		});
	}

	restaurants(
		lat:number, 
		long:number, 
		radius: number, 
		limit: number, 
		offset: number,
		price: number,
		user_id: number,
		cuisines: Array<string>,
		categories: Array<string> ) {
		
		if (this.restaurants_data && 
			are_similar(lat, long, this.lat, this.long) &&
			this.limit == limit &&
			this.offset == offset) {
			// already loaded data
			return Promise.resolve(this.restaurants_data);
		}

		this.lat = lat;
		this.long = long;
		this.limit = limit;
		this.offset = offset;

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });

		let obj = {
			lat: lat,
			long: long,
			radius: radius,
			limit: limit,
			offset: offset,
			price: price ? price : 2,
			user_id: user_id,
			cuisines: cuisines.join(","),
			categories: categories.join(","),
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
			}, error => {
				this.restaurants_data = {error: JSON.parse(error._body).error};
				resolve(this.restaurants_data);
			});
		});	
	}

	details(res_id) {
		if (this.reviews_data) {
			// already loaded data
			return Promise.resolve(this.reviews_data);
		}

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(this.url + '/restaurants/details/' + res_id)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.reviews_data = data;
				resolve(this.reviews_data);
			}, error => {
				this.reviews_data = {error: JSON.parse(error._body).error};
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
			}, error => {
				this.photos_data = {error: JSON.parse(error._body).error};
				resolve(this.photos_data);
			});
		});	
	}
}
