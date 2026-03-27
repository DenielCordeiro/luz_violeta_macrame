import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { News } from 'src/app/interfaces/news.interface';

@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.sass'],
})
export class CarouselComponent {
  @Input() imagesCarousel: News[] = [];

  constructor( public dialog: MatDialog) {}

}
