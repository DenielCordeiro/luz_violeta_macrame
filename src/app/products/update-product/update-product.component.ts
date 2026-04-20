import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";

import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Product } from "src/app/interfaces/product.interface";

@Component({
    selector: 'app-update-product',
    templateUrl: './update-product.component.html',
    styleUrls: ['./update-product.component.sass'],
})
export class UpdateProductComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public updateData: Product[],
        private formBuilder: FormBuilder,
    ) {};

    ngOnInit(): void {};
}