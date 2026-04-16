import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect, MatOption } from "@angular/material/select";

import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from 'src/app/interfaces/product.interface';

@Component({
  selector: 'app-add-or-edit-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './add-or-edit-product.component.html',
  styleUrls: ['./add-or-edit-product.component.sass'],
})
export class AddOrEditProductComponent implements OnInit {
  public form!: FormGroup;

  private productService: ProductsService = inject(ProductsService);

  public product!: Product;
  public files!: Set<File>;

  public categories: string[] = ['Colares', 'Pulseiras', 'Gargatilhas', 'Braceletes', 'Aneis'];
  public groups: string[] = ['Verão', 'Outono', 'Inverno', 'Primavera'];
  public newOrExistCategory: string = 'Nova';
  public newOrExistGroups: string = 'Nova';

  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: Product[],
    public dialog: MatDialog,
    public dialogAddOrEdit: MatDialogRef<AddOrEditProductComponent>,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.buildingForm();
  }

  public buildingForm(): void {
    if(this.updateData !== null) {
      this.updateData.forEach(product => {
        this.form = this.formBuilder.group({
          "id": product._id,
          "name": product.name,
          "description": product.description,
          "valor": product.valor,
          "type": product.type,
          "groups": product.groups,
          "file": product.file
        });
      });
    } else {
      this.form = this.formBuilder.group({
        "name": [null],
        "description": [null],
        "valor": [null],
        "type": [null],
        "groups": [null],
        "file": [null]
      });
    };
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

    formData.append('type', this.form.value.type);
    formData.append('valor', this.form.value.valor);
    formData.append('name', this.form.value.name);
    formData.append('description', this.form.value.description);
    formData.append('groups', this.form.value.groups);
    formData.append('file', this.form.value.file);

    return formData;
  }

  public addOrEditProduct(): void {
    const formData = this.buildFormData();

    if (this.updateData !== null) {
      this.productService.updateProduct(formData, this.form.value.id)
        .then(data => {
          this.dialogAddOrEdit.close(data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.dialogAddOrEdit.afterClosed().subscribe(result => {
            console.log('Finalizou, resultado: ', result);
          });
        });
    } else {
      this.productService.createProduct(formData)
        .then(data => {
          this.dialogAddOrEdit.close(data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.dialogAddOrEdit.afterClosed().subscribe(result => {
            console.log('Finalizou, resultado: ', result);
          });
        });
    };
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

  public closeModal(): void {
    this.dialog.closeAll();
  }
}
