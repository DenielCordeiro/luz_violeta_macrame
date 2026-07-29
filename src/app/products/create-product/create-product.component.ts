import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { MATERIAL_IMPORTS } from "src/app/shared/material.imports";
import { MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

import { ProductsService } from "src/app/services/products/products.service";

import { Deadline, Warranty } from "src/app/interfaces/product.interface";

@Component({
    selector: 'app-create-product',
    imports: [
		ReactiveFormsModule,
        MATERIAL_IMPORTS,
        MatIconModule,
        MatSelectModule
	],
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.sass'],
})
export class CreateProductComponent implements OnInit {
    public form!: FormGroup;
    private productService: ProductsService = inject(ProductsService);
    public files!: Set<File>;
    public categories: string[] = [];
    public types: string[] = [];
    public newOrExistCategory: string = "Existente";
    public newOrExistTypes: string = "Existente";

    public warranties: Warranty[] = [
        { value: 3, viewValue: '3 meses contra defeitos de fabricação' },
        { value: 6, viewValue: '6 meses contra defeitos de fabricação' },
        { value: 12, viewValue: '12 meses contra defeitos de fabricação' }
    ];

    public deadlines: Deadline[] = [
        { value: 5, viewValue: '5 dias' },
        { value: 10, viewValue: '10 dias' },
        { value: 15, viewValue: '15 dias' }
    ];

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<CreateProductComponent>,
    ){};

    ngOnInit(): void {
        this.buildingForm();
    };

    public buildingForm(): void {
        this.form = this.formBuilder.group({
            "name": [null],
            "description": [null],
            "included_items": [null],
            "warranty": [null],
            "price": [null],
            "stock": [null],
            "type": [null],
            "category": [null],
            "characteristics": [null],
            "deadline": [null],
            "packaging": this.formBuilder.group({
                "weight": [null],
                "height": [null],
                "width": [null],
                "length": [null],
            }),
            "file": [null],
        });
    }

    public onChangeFile(event: any): void {
        if (event.target.files && event.target.files[0]) {
            const selectFiles = <FileList>event.srcElement.files;
            const fileNames = [];
            this.files = new Set();

            for (let i = 0; i < selectFiles.length; i++) {
                fileNames.push(selectFiles[i].name);
                this.files.add(selectFiles[i]);
            }

            this.files.forEach(file => {
                this.form.patchValue({
                    file: file,
                });
            });

            this.form.get('file')?.updateValueAndValidity();
        };
    }

    public buildFormData(): FormData {
        const formData = new FormData();
        
        const formValues = this.form.value;

        if (formValues.name) formData.append('name', formValues.name);
        if (formValues.description) formData.append('description', formValues.description);
        if (formValues.included_items) formData.append('included_items', formValues.included_items);
        if (formValues.warranty) formData.append('warranty', formValues.warranty);
        if (formValues.price) formData.append('price', formValues.price);
        if (formValues.stock) formData.append('stock', formValues.stock);
        if (formValues.category) formData.append('category', formValues.category);
        if (formValues.type) formData.append('type', formValues.type);
        if (formValues.characteristics) formData.append('characteristics', formValues.characteristics);
        if (formValues.deadline) formData.append('deadline', formValues.deadline);
        
        if (formValues.packaging) {
            formData.append('packaging', JSON.stringify(formValues.packaging));
        }

        if (formValues.file) {
            formData.append('file', formValues.file);
        }        

        return formData;
    }

     public changeOptionCategories(): boolean {
        if (this.newOrExistCategory == "Nova") {
            this.newOrExistCategory = "Existente";
        } else {
            this.newOrExistCategory = "Nova";
        }

        return true;
    }

    public changeOptionTypes(): boolean {
        if (this.newOrExistTypes == "Nova") {
            this.newOrExistTypes = "Existente";
        } else {
            this.newOrExistTypes = "Nova";
        }

        return true;
    }

    public creatingProduct(): void {
        const formData = this.buildFormData();

        this.productService.createProduct(formData)
            .then((response) => {
                this.dialogRef.close(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }
}