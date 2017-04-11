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
	activity_data: any;
	
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

	filters() {
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
		cuisines: Array<string>) {
		
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

	details(res_id:string) {
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

	rating(user_id:number, res_id:string, liked:boolean, specific:string) {

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });

		let obj = {
			user_id,
			res_id,
			liked,
			specific
		};
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.post(this.url + '/users/rating/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				resolve(data);
			}, error => {
				resolve({error: JSON.parse(error._body).error});
			});
		});
	}

	activity(user_id:number, other_id:number) {
		if (1 + 1 == 1) {
			// already loaded data
			return Promise.resolve(this.activity_data);
		}

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(`${this.url}/users/activity/${user_id}/${other_id}`)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				resolve(data);
			}, error => {
				resolve({error: JSON.parse(error._body).error});
			});
		});	
	}

	friends_activity(user_id:number) {
		if (this.activity_data) {
			// already loaded data
			return Promise.resolve(this.activity_data);
		}

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(this.url + '/users/activity/friends/' + user_id)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.activity_data = data;
				resolve(this.activity_data);
			}, error => {
				this.activity_data = {error: JSON.parse(error._body).error};
				resolve(this.activity_data);
			});
		});	
	}

	get_friends(user_id:number) {
		// how tf do you get rid of this
		if (1 * 1 == 2) {
			// already loaded data
			return Promise.resolve(this.activity_data);
		}

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(this.url + '/friends/' + user_id)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				resolve(data);
			}, error => {
				resolve(error);
			});
		});	
	}

	respond_request(response:boolean, user_id:number, oth_id:number) {

		// how tf do you get rid of this
		if (1 * 1 == 2) {
			// already loaded data
			return Promise.resolve(this.activity_data);
		}

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });

		let obj = {
			response,
			user_id,
			oth_id,
		};
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.post(this.url + '/friends/respond/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				resolve(data);
			}, error => {
				resolve({error: JSON.parse(error._body).error});
			});
		});
	}

	search_users(user_id:number, query:string) {

		// how tf do you get rid of this
		if (1 * 1 == 2) {
			// already loaded data
			return Promise.resolve(this.activity_data);
		}

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });

		let obj = {
			user_id,
			query,
		};
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.post(this.url + '/users/search/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				resolve(data);
			}, error => {
				resolve({error: JSON.parse(error._body).error});
			});
		});
	}

	friend_request(user_from_id:number, user_to_id:number) {

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });

		let obj = {
			user_from_id,
			user_to_id,
		};
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.post(this.url + '/friends/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				resolve(data);
			}, error => {
				resolve({error: JSON.parse(error._body).error});
			});
		});
	}

	delete_friend(user_id1:number, user_id2:number) {

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers });

		let obj = {
			user_id1,
			user_id2,
		};
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.post(this.url + '/friends/delete/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				resolve(data);
			}, error => {
				resolve({error: JSON.parse(error._body).error});
			});
		});
	}

	notifications(user_id: number) {

		// how tf do you get rid of this
		if (1 * 1 == 2) {
			// already loaded data
			return Promise.resolve(this.activity_data);
		}
		
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(this.url + '/notifications/' + user_id)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.activity_data = data;
				resolve(this.activity_data);
			}, error => {
				resolve({error: JSON.parse(error._body).error});
			});
		});
	}

	dismiss_recommendation(user_from_id: number, user_to_id: number, res_id: string) {

		// how tf do you get rid of this
		if (1 * 1 == 2) {
			// already loaded data
			return Promise.resolve(this.activity_data);
		}
		
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(`${this.url}/notifications/dismiss/${user_from_id}/${user_to_id}/${res_id}`)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.activity_data = data;
				resolve(this.activity_data);
			}, error => {
				resolve({error: JSON.parse(error._body).error});
			});
		});
	}
}
