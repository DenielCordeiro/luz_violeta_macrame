import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "src/app/guards/auth.service";
import { MenuService } from "src/app/services/menu/menu.service";
import { User } from "src/app/interfaces/user.interface";
import { Router } from "@angular/router";

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
    authService: AuthService = inject(AuthService);
    menuService: MenuService = inject(MenuService);
    hidePassword: WritableSignal<boolean> = signal(true);
    currentRoute: string = "";

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,   
        private router: Router
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

    async makeLogin(): Promise<void> {
        try {
            if (this.loginForm.valid) {
                await this.authService.authUser(this.loginForm.value);

                this.currentRoute = this.router.url;
                this.closingMenu(this.currentRoute);                
            } else {
                console.log('[ERRO]: Formulário inválido!')
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