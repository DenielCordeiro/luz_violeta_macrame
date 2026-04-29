import { Component, OnInit } from '@angular/core';
import { NewsletterService } from './../services/newsletter/newsletter.service';
import { News } from '../interfaces/news.interface';
import { CarouselComponent } from './carousel/carousel.component';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [
    CarouselComponent,
  ],
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.sass'],
})
export class NewsletterComponent implements OnInit {
  public carousel: News[] = [];

  constructor(
    private newsletterService: NewsletterService,
  ) {}

  ngOnInit(): void {
    this.gettingImages();
  }
  
  public gettingImages(): void {}
}
