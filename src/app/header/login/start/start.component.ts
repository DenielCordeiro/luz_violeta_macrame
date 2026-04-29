import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

import { AuthService } from "src/app/guards/auth.service";
import { MenuService } from "src/app/services/menu/menu.service";

@Component({
    selector: 'app-start',
    standalone: true,
    imports: [
        ReactiveFormsModule,
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
    public loginForm!: FormGroup;
    private authService: AuthService = inject(AuthService);
    private menuService: MenuService = inject(MenuService);
    public hidePassword: WritableSignal<boolean> = signal(true);
    public currentRoute: string = "";

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,   
        private router: Router
    ) {}
    
    ngOnInit(): void {
        this.buildingForm();
        this.currentRoute = this.router.url;
    }

    public buildingForm(): void {
        this.loginForm = this.formBuilder.group({
            "email": [null, [Validators.required, Validators.email]],
            "password": [null, Validators.required]
        });
    }

    public async makeLogin(): Promise<void> {
        try {
            if (this.loginForm.valid) {
                await this.authService.authUser(this.loginForm.value);

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

    public changeHidePassword(event: MouseEvent): void {
        this.hidePassword.set(!this.hidePassword());
        event.stopPropagation();
    }

    public closeDialog(): void {
        this.dialog.closeAll();
    }
    
    public registering(nextUrl: string): void {
        this.menuService.saveCurrentUrl(this.currentRoute);
        this.menuService.closeMenu(nextUrl);
        this.dialog.closeAll();
    }

    public closingMenu(url: string): void {
        this.menuService.closeMenu(url);
        this.dialog.closeAll();
    }
}