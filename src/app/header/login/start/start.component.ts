import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { UsersService } from "src/app/services/users/users.service";
import { User } from "src/app/interfaces/user.interface";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.sass']
})
export class StartComponent implements OnInit {
    loginForm!: FormGroup;

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
        try {
            if (this.loginForm.valid) {
                const userProfile = await this.userService.authUser(this.loginForm.value);
                return userProfile;
            } else {
                return undefined; 
            }
            
        } catch (error) {
            console.error({
                fail: '[ERRO]: Não foi possível fazer login!',
                message: error
            });
            
            throw error; 
        }
    }

    closeDialog(): void {
        this.dialog.closeAll();
    }
}