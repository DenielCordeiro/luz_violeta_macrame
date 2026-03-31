import { Component, OnInit, signal, Signal, WritableSignal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { UsersService } from "src/app/services/users/users.service";
import { MenuService } from "src/app/services/menu/menu.service";
import { User } from "src/app/interfaces/user.interface";

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormField,
        MatLabel,
        MatInputModule,
    ],
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.sass']
})
export class StartComponent implements OnInit {
    loginForm!: FormGroup;
    hidePassword: WritableSignal<boolean> = signal(true);

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private userService: UsersService,
        private menuService: MenuService        
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

    changeHidePassword(event: MouseEvent): void {
        this.hidePassword.set(!this.hidePassword());
        event.stopPropagation();
    }

    closeDialog(): void {
        this.dialog.closeAll();
    }

    closingMenu(url: string): void {
        this.menuService.closeMenu(url);
        this.dialog.closeAll();
    }
}