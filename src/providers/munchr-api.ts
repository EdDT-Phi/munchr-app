import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UserService } from './user-service';
import 'rxjs/add/operator/map';


@Injectable()
export class MunchrApi {
	url: string;

	saved_data: any = {};

	data: any;

	constructor(private http: Http, private userService: UserService) {
		// this.url = 'http://localhost:5000'; // dev
		this.url = 'https://munchr-test.herokuapp.com'; // prod
		// this.url = 'https://munchr.herokuapp.com'; // prod
	}

	get_api_call(uri:string, saved:string): Promise<any> {
		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(this.url + uri)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.saved_data[saved] = data;
				resolve(this.saved_data[saved]);
			}, error => {
				this.saved_data[saved] = {error: JSON.parse(error._body).error};
				resolve(this.saved_data[saved]);
			});
		});
	}

	post_api_call(uri:string, obj:Object): Promise<any> {

		return new Promise(resolve => {
			this.userService.get_user_token()
			.then(token => {

				const headers = new Headers();
				headers.append('Content-Type', 'application/x-www-form-urlencoded');
				headers.append('Authorization', 'Token ' + token);
				const options = new RequestOptions({ headers: headers });

				const data = Object.keys(obj).map(function(key) {
				    return key + '=' + obj[key];
				}).join('&');

				this.http.post(this.url + uri, data, options)
				.map(res => res.json())
				.subscribe(data => {
					this.data = data;
					resolve(this.data);
				}, error => {
					this.data = {error: JSON.parse(error._body).error};
					resolve(this.data);
				});
			}, error => {});
		});
	}


	filters() {

		if (this.saved_data['filters']) {
			// already loaded data
			return Promise.resolve(this.saved_data['filters']);
		}

		return this.get_api_call('/restaurants/filters', 'filters');
	}

	restaurants(
		lat:number, 
		long:number, 
		radius: number, 
		user_id: number,
		cuisines: Array<string>
	) {

		let obj = {
			lat: lat,
			long: long,
			radius: radius,
			user_id: user_id,
			cuisines: cuisines.join(","),
		};
		
		return this.post_api_call('/restaurants/', obj);
	}

	details(user_id:number, res_id:string, lat:number, lng:number) {
		return this.post_api_call('/restaurants/details/', { lat, lng, user_id, res_id });
	}

	rating(user_id:number, rating_id:number, res_id:string, liked:boolean, specific:string, share:boolean) {

		let obj = {
			user_id,
			rating_id,
			res_id,
			liked,
			specific,
			share,
		};

		return this.post_api_call('/users/rating/', obj);
	}

	dismiss_rating(rating_id: number) {
		return this.post_api_call(`/users/munch/dismiss/`, { rating_id });
	}

	activity(user_id:number, other_id:number) {
		return this.post_api_call(`/users/activity/`, { user_id, other_id });
	}

	friends_activity(user_id:number) {
		return this.post_api_call('/users/activity/friends/', { user_id });
	}

	get_friends(user_id:number) {
		return this.post_api_call('/friends/', { user_id });
	}

	respond_request(response:boolean, user_id:number, oth_id:number) {
		return this.post_api_call('/friends/respond/', { response, user_id, oth_id });
	}

	search_users(user_id:number, query:string) {
		return this.post_api_call('/users/search/', { user_id, query });
	}

	friend_request(user_from_id:number, user_to_id:number) {
		return this.post_api_call('/friends/', { user_from_id, user_to_id });
	}

	delete_friend(user_id1:number, user_id2:number) {
		return this.post_api_call('/friends/delete/', { user_id1, user_id2 });
	}

	notifications(user_id: number) {
		return this.post_api_call('/notifications/', { user_id });
	}

	dismiss_recommendation(user_from_id: number, user_to_id: number, res_id: string) {
		return this.post_api_call(`notifications/dismiss/`, { user_from_id, user_to_id, res_id });
	}

	get_stars(user_id: number) {
		return this.post_api_call('/stars/', { user_id });
	}

	star_res(user_id:number, res_id:string) {
		return this.post_api_call('/stars/new/', { res_id });
	}

	unstar_res(user_id: number, res_id:string) {
		return this.post_api_call(`/stars/unstar/`, { user_id, res_id });
	}

	search_restaurants(lat:number, lng:number, query:string) {
		return this.post_api_call('/restaurants/search/', { lat, lng, query });
	}

	munch(user_id:number, res_id:string) {
		return this.post_api_call('/users/munch/', { user_id, res_id });
	}
}
