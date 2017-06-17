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

	get_api_call(uri:string): Promise<any> {


		if (this.saved_data[uri]) {
			// already loaded data
			return Promise.resolve(this.saved_data[uri]);
		}

		return new Promise(resolve => {
			// We're using Angular HTTP provider to request the data,
			// then on the response, it'll map the JSON data to a parsed JS object.
			// Next, we process the data and resolve the promise with the new data.

			this.http.get(this.url + uri)
			.map(res => res.json())
			.subscribe(data => {
				// we've got back the raw data, now generate the core schedule data
				// and save the data for later reference
				this.saved_data[uri] = data;
				resolve(this.saved_data[uri]);
			}, error => {
				this.saved_data[uri] = {error: JSON.parse(error._body).error};
				resolve(this.saved_data[uri]);
			});
		});
	}

	post_api_call(uri:string, obj:Object): Promise<any> {

		return new Promise(resolve => {
			this.userService.get_user_token()
			.then(token_obj => {

				const headers = new Headers();
				headers.append('Content-Type', 'application/x-www-form-urlencoded');
				headers.append('Authorization', 'Token ' + token_obj.token);
				const options = new RequestOptions({ headers: headers });

				obj['user_id'] = token_obj.user_id;

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

		return this.get_api_call('/restaurants/filters');
	}

	restaurants(
		lat:number, 
		long:number, 
		radius: number, 
		cuisines: Array<string>
	) {

		let obj = {
			lat: lat,
			long: long,
			radius: radius,
			cuisines: cuisines.join(","),
		};
		
		return this.post_api_call('/restaurants/', obj);
	}

	details(res_id:string, lat:number, lng:number) {
		return this.post_api_call('/restaurants/details/', { lat, lng, res_id });
	}

	rating(rating_id:number, res_id:string, liked:boolean, specific:string, share:boolean) {

		let obj = {
			rating_id,
			res_id,
			liked,
			specific,
			share,
		};

		return this.post_api_call('/users/rating/', obj);
	}

	dismiss_rating(rating_id: number) {
		return this.post_api_call('/users/munch/dismiss/', { rating_id });
	}

	activity(other_id:number) {
		return this.post_api_call('/users/activity/', { other_id });
	}

	friends_activity() {
		return this.post_api_call('/users/activity/friends/', { });
	}

	get_friends() {
		return this.post_api_call('/friends/', { });
	}

	respond_request(response:boolean, oth_id:number) {
		return this.post_api_call('/friends/respond/', { response, oth_id });
	}

	search_users(query:string) {
		return this.post_api_call('/users/search/', { query });
	}

	friend_request(user_to_id:number) {
		return this.post_api_call('/friends/', { user_to_id });
	}

	delete_friend(user_to_id:number) {
		return this.post_api_call('/friends/delete/', { user_to_id });
	}

	notifications() {
		return this.post_api_call('/notifications/', { });
	}

	dismiss_recommendation(user_to_id: number, res_id: string) {
		return this.post_api_call('notifications/dismiss/', { user_to_id, res_id });
	}

	get_stars() {
		return this.post_api_call('/stars/', { });
	}

	star_res(res_id:string) {
		return this.post_api_call('/stars/new/', { res_id });
	}

	unstar_res(res_id:string) {
		return this.post_api_call('/stars/unstar/', { res_id });
	}

	search_restaurants(lat:number, lng:number, query:string) {
		return this.post_api_call('/restaurants/search/', { lat, lng, query });
	}

	munch(res_id:string) {
		return this.post_api_call('/users/munch/', { res_id });
	}
}
