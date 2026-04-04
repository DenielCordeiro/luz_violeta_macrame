import { Injectable } from "@angular/core";
import { CrudFooterService } from "./crud-footer/crud-footer.service";
import { Review } from "src/app/interfaces/review.interface";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class FooterService extends CrudFooterService<Review> {
    constructor(public httpClient: HttpClient) {
        super(httpClient, '/footer');
    }
}