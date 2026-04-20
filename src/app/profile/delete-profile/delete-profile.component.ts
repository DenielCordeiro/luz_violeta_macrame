import { Component, inject, Inject } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { UsersService } from "src/app/services/users/users.service";

@Component({
    selector: 'app-delete-profile',
    imports: [MatButtonModule],
    templateUrl: './delete-profile.component.html',
    styleUrls: ['./delete-profile.component.sass'],
})
export class DeleteProfileComponent {
    private userService: UsersService = inject(UsersService);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { profileName: string, profileId: string },
        private dialogRef: MatDialogRef<DeleteProfileComponent>
    ) {
        console.log("Nome: ", this.data.profileName);
        console.log("ID: ", this.data.profileId);
    }

    public onDelete(): void {
        this.userService.deleteUser(this.data.profileId)
            .then(result => {
                console.log(result.message);
            })
            .catch(error => {
                console.error({
                    message: 'Não foi possível deletar seu perfil!',
                    fail: error
                });
            })
             .finally(() => {
                 this.closeDialog();
             });
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }
}