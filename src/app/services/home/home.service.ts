import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudHomeService } from './crud-home/crud-home.service';
import { Home } from 'src/app/interfaces/home.interface';


@Injectable({
	providedIn: 'root'
})
export class HomeService extends CrudHomeService<Home> {

	constructor(public httpClient: HttpClient) {
		super(httpClient, '/home');
	}
}
