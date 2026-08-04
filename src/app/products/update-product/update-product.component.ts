import { Component, Inject, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { MATERIAL_IMPORTS } from "src/app/shared/material.imports";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

import { QuillEditorComponent } from 'ngx-quill';

import { ProductsService } from "src/app/services/products/products.service";

import { Deadline, Product, Warranty } from "src/app/interfaces/product.interface";

@Component({
    selector: 'app-update-product',
    imports: [
		ReactiveFormsModule,
        MATERIAL_IMPORTS,
        MatIconModule,
        MatSelectModule,
        QuillEditorComponent
	],
    templateUrl: './update-product.component.html',
    styleUrls: ['./update-product.component.sass'],
})
export class UpdateProductComponent implements OnInit {
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

    public quillConfig = {
        toolbar: [
            [{ 'font': [] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean']
        ]
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) public product: Product,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<UpdateProductComponent>,
    ) {};

    ngOnInit(): void {
        this.buildingForm();
    };

    public buildingForm(): void {
        this.form = this.formBuilder.group({
            "name": this.product?.name,
            "description": this.product?.description,
            "included_items": this.product?.included_items,
            "warranty": this.product?.warranty,
            "price": this.product?.price,
            "stock": this.product?.stock,
            "type": this.product?.type?.name,
            "category": this.product?.category?.name,
            "characteristics": this.product?.characteristics,
            "deadline": this.product?.deadline,
            "packaging": this.formBuilder.group({
                "weight": this.product?.packaging?.weight,
                "height": this.product?.packaging?.height,
                "width": this.product?.packaging?.width,
                "length": this.product?.packaging?.length,
            }),
            "file": null,
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

        if (formValues.file instanceof File) {
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

    public updatingProduct(): void {
        const formData = this.buildFormData();
        const productId = this.product._id;

        this.productService.updateProduct(formData, productId)
            .then((response) => {
                this.dialogRef.close(response);
            })
            .catch((error) => {
                console.error('Erro ao atualizar produto:', error);
            });
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }
}