import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { User } from "src/app/interfaces/user.interface";
import { UsersService } from "src/app/services/users/users.service";

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.sass']
})
export class StartComponent implements OnInit {
    loginForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UsersService
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

    closeDialog(): void {}
}