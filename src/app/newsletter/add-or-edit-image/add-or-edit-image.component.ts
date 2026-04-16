import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewsletterService } from 'src/app/services/newsletter/newsletter.service';
import { News } from 'src/app/interfaces/news.interface';

@Component({
  selector: 'app-add-or-edit-image',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-or-edit-image.component.html',
  styleUrls: ['./add-or-edit-image.component.sass'],
})
export class AddOrEditImageComponent implements OnInit {
  public form!: FormGroup;
  public files!: Set<File>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: News,
    public dialogAddOrEditImage: MatDialogRef<AddOrEditImageComponent>,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private newsletterService: NewsletterService,
  ) {}

  ngOnInit(): void {
    this.buildingForm();
  }

  public buildingForm(): void {
    if(this.updateData._id !== undefined) {
      this.form = this.formBuilder.group({
        "id": this.updateData._id,
        "type": this.updateData.type,
        "linkProduct": this.updateData.linkProduct,
        "file": this.updateData.file
      });
    } else {
      this.form = this.formBuilder.group({
        "type": this.updateData.type,
        "linkProduct": [null],
        "file": [null]
      });
    }
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
    formData.append('linkProduct', this.form.value.linkProduct);
    console.log(this.form.value.file);

    formData.append('file', this.form.value.file);

    return formData;
  }

  public addOrEditImage(): void {
    const formData = this.buildFormData();

    if (this.updateData._id !== undefined) {
      this.newsletterService.updateImage(formData, this.form.value.id)
        .then(data => {
          this.dialogAddOrEditImage.close(data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.dialogAddOrEditImage.beforeClosed().subscribe(() => {
            console.log('Imagem atualizada com sucesso! ');
          });
        });
    } else {
      this.newsletterService.createImage(formData)
        .then(data => {
          this.dialogAddOrEditImage.close(data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.dialogAddOrEditImage.beforeClosed().subscribe(() => {
            console.log('Imagem adicionada com sucesso! ');
          });
        });
    }
  }

  public closeModal(): void {
    this.dialog.closeAll();
  }
}
