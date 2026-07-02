import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from '@angular/material/button';

import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from 'src/app/interfaces/product.interface';

@Component({
    selector: 'app-add-or-edit-product',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule
    ],
    templateUrl: './add-or-edit-product.component.html',
    styleUrls: ['./add-or-edit-product.component.sass'],
})
export class AddOrEditProductComponent implements OnInit {
    public createForm!: FormGroup;
    private productService: ProductsService = inject(ProductsService);

    public product!: Product;
    public files!: Set<File>;

    public categories: string[] = ['Colares', 'Pulseiras', 'Gargatilhas', 'Braceletes', 'Aneis'];
    public groups: string[] = ['Verão', 'Outono', 'Inverno', 'Primavera'];
    
    constructor(
        // Se o Dialog envia apenas UM produto para edição, o ideal é receber como Product e não Product[]
        @Inject(MAT_DIALOG_DATA) public updateData: Product | Product[], 
        public dialog: MatDialog,
        public dialogAddOrEdit: MatDialogRef<AddOrEditProductComponent>,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.buildingForm();
    }

    public buildingForm(): void {
        // 1. Inicializa o formulário com a estrutura padrão vazia (evita que o HTML quebre)
        this.createForm = this.formBuilder.group({
            id: [null],
            name: [null],
            description: [null],
            valor: [null],
            category: [null], // Padronizado para 'category' no singular
            file: [null]
        });

        // 2. Se houver dados de update, aplica os valores usando patchValue
        if (this.updateData !== null) {
            // Tratativa caso venha como Array ou Objeto único
            const product = Array.isArray(this.updateData) ? this.updateData[0] : this.updateData;
            
            if (product) {
                this.createForm.patchValue({
                    id: product._id,
                    name: product.name,
                    description: product.description,
                    valor: product.valor,
                    category: product.category,
                    file: product.file
                });
            }
        }
    }

    public onChangeFile(event: any): void {
        if (event.target.files && event.target.files[0]) {
            const selectFiles = <FileList>event.target.files;
            this.files = new Set();

            for (let i = 0; i < selectFiles.length; i++) {
                this.files.add(selectFiles[i]);
            }

            // Pega o primeiro arquivo para o formulário
            this.createForm.patchValue({
                file: selectFiles[0]
            });
            this.createForm.get('file')?.updateValueAndValidity();
        }
    }

    public buildFormData(): FormData {
        const formData = new FormData();
        // Adiciona segurança caso o ID seja nulo (em criações)
        if (this.createForm.value.id) {
            formData.append('id', this.createForm.value.id);
        }
        formData.append('name', this.createForm.value.name ?? '');
        formData.append('valor', this.createForm.value.valor ?? '');
        formData.append('description', this.createForm.value.description ?? '');
        formData.append('category', this.createForm.value.category ?? '');
        formData.append('file', this.createForm.value.file);

        return formData;
    }

    public creatingProduct(): void {
        const formData = this.buildFormData();
        const productId = this.createForm.value.id;

        if (productId) {
            // Modo Edição
            this.productService.updateProduct(formData, productId)
                .then(data => this.dialogAddOrEdit.close(data))
                .catch(error => console.error(error));
        } else {
            // Modo Criação
            this.productService.createProduct(formData)
                .then(data => this.dialogAddOrEdit.close(data))
                .catch(error => console.error(error));
        }
    }

    public closeModal(): void {
        this.dialogAddOrEdit.close();
    }
}