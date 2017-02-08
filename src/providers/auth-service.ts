import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
	data: any;

	constructor(public http: Http) {
		console.log('Hello AuthService Provider');
	}

	login(email, password) {
		// if (this.data) {
		// 	// already loaded data -- check if different user/password though!
		// 	return Promise.resolve(this.data);
		// }

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });
		let obj = {"email": email, "password": password}
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		console.log(data)

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.
			let headers = new Headers();

			this.http.post('https://munchr.herokuapp.com/login/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.data = data;
				resolve(this.data);
			});
		});
	}

}
