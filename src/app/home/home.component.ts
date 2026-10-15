import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HomeShowcaseComponent } from './home-showcase/home-showcase.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, MatButtonModule, MatIconModule, HomeShowcaseComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.sass',
})
export class HomeComponent {}
