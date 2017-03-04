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
	url: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	fb_id: string;
	photo: string;

	constructor(public http: Http) {
		// this.url = 'http://localhost:5000'; // dev
		this.url = 'https://munchr-test.herokuapp.com'; // test
		// this.url = 'https://munchr.herokuapp.com'; // prod
	}

	login(email: string, password: string) {
		if (this.data && this.password == password && this.email == email) {
			// already loaded data -- check if different user/password though!
			return Promise.resolve(this.data);
		}

		this.email = email;
		this.password = password;

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });
		let obj = {"email": email, "password": password}
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.post(this.url + '/login/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.data = data;
				resolve(this.data);
			}, error => {
				this.data = {error: JSON.parse(error._body).error};
				resolve(this.data);
			});
		});
	}

	create_account(
		first_name: string,
		last_name: string,
		email: string,
		password: string,
		fb_id: string,
		photo: string ) {

		if (this.data && 
			this.first_name == first_name &&
			this.last_name == last_name &&
			this.email == email &&
			this.fb_id == fb_id &&
			this.password == password &&
			this.photo == photo) {

			return Promise.resolve(this.data);
		}

		this.first_name = first_name;
		this.last_name = last_name;
		this.email = email;
		this.password = password;
		this.fb_id = fb_id;
		this.photo = photo;

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let options = new RequestOptions({ headers: headers });
		let obj = {
			"first_name": first_name,
			"last_name": last_name,
			"email": email,
			"password": password,
			"fb_id": fb_id,
			"photo": photo,
		};
		let data = Object.keys(obj).map(function(key) {
		    return key + '=' + obj[key];
		}).join('&');

		// don't have the data yet
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.post(this.url + '/users/', data, options)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.data = data;
				resolve(this.data);
			}, error => {
				this.data = {error: JSON.parse(error._body).error};
				resolve(this.data);
			});
		});
	}
}
