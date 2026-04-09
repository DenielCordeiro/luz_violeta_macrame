import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-delete-profile',
    imports: [MatButtonModule],
    templateUrl: './delete-profile.component.html',
    styleUrls: ['./delete-profile.component.sass'],
})
export class DeleteProfileComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { profileName: string, profileId: number },
        private dialogRef: MatDialogRef<DeleteProfileComponent>
    ) {
        console.log("Nome: ", this.data.profileName);
        console.log("ID: ", this.data.profileId);
    }

    onDelete(): void {
        // Implement the delete logic here
        this.dialogRef.close();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}