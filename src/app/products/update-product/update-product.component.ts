import { Component, inject, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MATERIAL_IMPORTS } from "src/app/shared/material.imports";

import { ProductsService } from "src/app/services/products/products.service";

import { Product } from "src/app/interfaces/product.interface";

@Component({
    selector: 'app-update-product',
    imports: [
		ReactiveFormsModule,
        MATERIAL_IMPORTS
	],
    templateUrl: './update-product.component.html',
    styleUrls: ['./update-product.component.sass'],
})
export class UpdateProductComponent implements OnInit {
    public form!: FormGroup;
    private productService: ProductsService = inject(ProductsService);
    public files!: Set<File>;
    public currentImage!: any;
    public categories: string[] = [];
    public groups: string[] = [];
    public newOrExistCategory: string = "Existente";
    public newOrExistGroups: string = "Existente";

    constructor(
        @Inject(MAT_DIALOG_DATA) public updateData: Product[],
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<UpdateProductComponent>,
    ) {};

    ngOnInit(): void {
        this.buildingForm();
    };

    public buildingForm(): void {
        this.updateData.forEach(product => {
            this.form = this.formBuilder.group({
                "id": product._id,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "category": product.category,
                "type": product.type,
                "file":  [null],
            });
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
                file: file
                });
            });

            this.form.get('file')?.updateValueAndValidity();
        };
    }

    public buildFormData(): FormData {
        const formData = new FormData();

        formData.append('valor', this.form.value.valor);
        formData.append('name', this.form.value.name);
        formData.append('description', this.form.value.description);
        formData.append('category', this.form.value.category);
        formData.append('collection', this.form.value.collection);


        if (this.files == undefined) {
            this.currentImage = this.updateData[0]?.file;
            formData.append('file', this.currentImage)
        } else {
            formData.append('file', this.form.value.file);
        }

        return formData;
    }

     public changeOptionCategories(): boolean {
        if (this.newOrExistCategory == "Nova") {
            this.newOrExistCategory = "Existente";
        } else {
            this.newOrExistCategory = "Nova"
        }

        return true;
    }

    public changeOptionGroups(): boolean {
        if (this.newOrExistGroups == "Nova") {
            this.newOrExistGroups = "Existente";
        } else {
            this.newOrExistGroups = "Nova"
        }

        return true;
    }

    public updatingProduct(): void {
        const formData = this.buildFormData();

        console.log("Produto atualizado: ", formData);
        
        
        // this.productService.updateProduct(formData, this.form.value.id)
        //     .then(() => {
        //      this.dialogRef.close();
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
        //     .finally(() => {
        //         this.dialogRef.afterClosed().subscribe(result => {
        //             console.log('Finalizou, resultado: ', result);
        //         });
        //     });
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }
}