import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [RouterLink, MatButtonModule],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.sass'],
})
export class AboutComponent {}
