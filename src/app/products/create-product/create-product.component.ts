import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { ProductsService } from "src/app/services/products/products.service";

@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.sass'],
})
export class CreateProductComponent implements OnInit {
    public form!: FormGroup;
    private productService: ProductsService = inject(ProductsService);
    public files!: Set<File>;
    public categories: string[] = [];
    public groups: string[] = [];
    public newOrExistCategory: string = "Existente";
    public newOrExistGroups: string = "Existente";

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
            "valor": [null],
            "type": [null],
            "groups": [null],
            "file": [null]
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

        formData.append('type', this.form.value.type);
        formData.append('valor', this.form.value.valor);
        formData.append('name', this.form.value.name);
        formData.append('description', this.form.value.description);
        formData.append('groups', this.form.value.groups);
        formData.append('file', this.form.value.file);

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

    public creatingProduct(): void {
        const formData = this.buildFormData();

        this.productService.createProduct(formData)
            .then(() => {
                this.dialogRef.close();
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.dialogRef.afterClosed().subscribe(result => {
                    console.log('Finalizou, resultado: ', result);
                });
            });
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }
}