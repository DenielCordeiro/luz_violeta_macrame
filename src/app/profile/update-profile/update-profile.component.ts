import { Component, Inject } from "@angular/core";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

import { User } from "src/app/interfaces/user.interface";

@Component({
    selector: 'app-update-profile',
    imports: [MatButtonModule],
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.sass'],
})
export class UpdateProfileComponent {
    public personalForm!: boolean;
    public addressForm!: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { profile: User, formType: string },
        private diaalogRef: MatDialogRef<UpdateProfileComponent>,
    ) {

        this.initializeForm(this.data.formType);
    }

    public initializeForm(formType: string): void {
        this.personalForm = false;
        this.addressForm = false;

        console.log("formulários: ", this.personalForm, " e ", this.addressForm);
        

        if (formType === 'personal') {
            this.personalForm = true;

            console.log('Formulário de dados pessoais: ', this.personalForm);
        } else if (formType === 'address') {
            this.addressForm = true;

            console.log('Formulário de endereço: ', this.addressForm);
        } else {
            console.log('Tipo de formulário desconhecido');
        }
    }

    updatingProfileUser(): void {
        this.diaalogRef.close();
    }

    public closeDialog(): void {
        this.diaalogRef.close();
    }
}