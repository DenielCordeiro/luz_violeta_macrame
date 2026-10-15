import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { BaseCrud } from 'src/app/interfaces/base-crud.interface'
import { Home } from 'src/app/interfaces/home.interface';

import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export abstract class CrudHomeService<T extends BaseCrud> {
	http!: HttpClient;
	route!: string;

	constructor(
		http: HttpClient,
		route: string,
	) {
		this.http = http;
		this.route = environment.api + route;
	}

	public async getHomeData(): Promise<Home> {
		return await lastValueFrom(this.http.get<Home>(this.route))
			.then(result => {
				return result as T as Home;
			});
	}

	public async onlyFirtCreateHomeData(HomeData: FormData): Promise<Home> {
		return await lastValueFrom(this.http.post<Home>(this.route, HomeData))
			.then(result => {
				return result as T as Home;
			});
	}

	public async updateHomeData(HomeData: FormData, home_id: string): Promise<Home> {
		return await lastValueFrom(this.http.put<Home>(`${this.route}/${home_id}`, HomeData))
			.then(result => {
				return result as T as Home;
			});
	}

	public async deleteHomeData(home_id: string): Promise<Home> {
		return await lastValueFrom(this.http.delete<Home>(`${this.route}/${home_id}`))
			.then(result => {
				return result as T as Home;
			});
	}
}
