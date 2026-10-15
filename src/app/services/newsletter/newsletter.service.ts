import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudNewsletterService } from './crud-newsletter/crud-newsletter.service';
import { News } from 'src/app/interfaces/home.interface';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService extends CrudNewsletterService<News> {

  constructor( public httpClient: HttpClient ) {
    super(httpClient, '/newsletter');
  }
}
