import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.sass'],
})
export class CreateProductComponent implements OnInit {

    constructor(private formBuilder: FormBuilder){};

    ngOnInit(): void {};
}