import { Component } from '@angular/core';

import { MatTab, MatTabGroup } from '@angular/material/tabs';

import { About, Paragraph } from '../interfaces/about.interface';
import { ABOUT_MOCK } from './about.mock';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [
        MatTabGroup,
        MatTab,
    ],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.sass'],
})
export class AboutComponent {
    public about: About = ABOUT_MOCK;
    public companyParagraphs: Paragraph[] = [];
    public businesswomanParagraphs: Paragraph[] = [];

    constructor() {
        console.log("Dados da tela sobre: ", this.about);
        this.loadAbout();
    }

    loadAbout(): void {
        this.loadParagraphs(this.about);
    }

    loadParagraphs(dataAbout: About): void {
        this.companyParagraphs = dataAbout.company.paragraph;
        this.businesswomanParagraphs = dataAbout.businesswoman.paragraph;

        console.log("Paragrafos da empresa: ", this.companyParagraphs);
        console.log("Paragrafos  da empreemdedora: ", this.businesswomanParagraphs);
    }
}
