import { Component, OnInit, signal, Signal, WritableSignal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";

import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

import { UsersService } from "src/app/services/users/users.service";
import { User } from "src/app/interfaces/user.interface";

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        MatButtonModule,
        MatFormField,
        MatLabel,
        MatInputModule,
        MatIconModule
    ],
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.sass']
})
export class StartComponent implements OnInit {
    loginForm!: FormGroup;
    hidePassword: WritableSignal<boolean> = signal(true);

    constructor(
        private formBuilder: FormBuilder,
        private userService: UsersService,
        public dialog: MatDialog,
    ) {}
    
    ngOnInit(): void {
        this.buildingForm();
    }

    buildingForm(): void {
        this.loginForm = this.formBuilder.group({
            "email": [null, [Validators.required, Validators.email]],
            "password": [null, Validators.required]
        });
    }

   async makeLogin(): Promise<User | undefined> {
        // try {
        //     if (this.loginForm.valid) {
        //         const userProfile = await this.userService.authUser(this.loginForm.value);
        //         return userProfile;
        //     } else {
        //         return undefined; 
        //     }
            
        // } catch (error) {
        //     console.error({
        //         fail: '[ERRO]: Não foi possível fazer login!',
        //         message: error
        //     });
            
        //     throw error; 
        // }

        console.log("formulário: ", this.loginForm.value);

        return this.loginForm.value;
        
    }

    changeHidePassword(event: MouseEvent): void {
        this.hidePassword.set(!this.hidePassword());
        event.stopPropagation();
    }

    closeDialog(): void {
        this.dialog.closeAll();
    }
}