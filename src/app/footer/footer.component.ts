import { Component, OnInit } from "@angular/core";
import { Review } from "../interfaces/review.interface";
import { FooterService } from "../services/footer/footer.service";

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.sass'],
})
export class FooterComponent implements OnInit {
    avaliations: Review[] = [{
        userName: "Teste",
        review: "Eu amei a Luz Violeta Macrâme",
        date: Date.now(),
        stars: 3,
        filledStars: 2,
    }];

    reviews: Review[] = [];

    constructor(private footerService: FooterService ) {}

    ngOnInit(): void {}

    searchForReviews(): void {
        this.footerService.getReviews()
            .then(reviews => {
                this.reviews = reviews;
            })
            .catch(error => {
                console.error('ERRO: Não foi possível carregar as imagens', error);
            });
    }
}