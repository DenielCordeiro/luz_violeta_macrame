import { ChangeDetectorRef, Component, inject, Inject, OnInit, signal, WritableSignal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { UsersService } from "src/app/services/users/users.service";

import { User } from "src/app/interfaces/user.interface";

import { brasilStates } from "src/app/header/login/register/register.mock";

@Component({
    selector: 'app-update-profile',
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatInputModule,
        MatLabel,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.sass'],
})
export class UpdateProfileComponent implements OnInit {
    public registerForm!: FormGroup;
    public stateControl: FormControl = new FormControl('SP');
    private usersService: UsersService = inject(UsersService);
    public states: string[] = brasilStates;
    public hidePassword: WritableSignal<boolean> = signal(true);
    public personalForm!: boolean;
    public addressForm!: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { profile: User, formType: string },
        private diaalogRef: MatDialogRef<UpdateProfileComponent>,
        private formBuilder: FormBuilder,
        private changeDetector: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.buildingForm();
        this.initializeForm(this.data.formType);
        this.postalCodeObserver();
    }

    public initializeForm(formType: string): void {
        this.personalForm = false;
        this.addressForm = false;

        if (formType === 'personal') {
            this.personalForm = true;
        } else if (formType === 'address') {
            this.addressForm = true;
        } else {
            console.log('Tipo de formulário desconhecido');
        }
    }
    
    public buildingForm(): void {
		this.registerForm = this.formBuilder.group({
			"name":  [null, Validators.required],
			"email":[null, [Validators.required, Validators.email]],
			"password": null,
			"cellphone": null,
			"postalCode": null,
			"state": null,
			"city": null,
			"neighborhood": null,
			"street": null,
			"houseNumber": null,
		});

        this.registerForm.patchValue(this.data.profile);
	}

    postalCodeObserver(): void {
		this.registerForm.get('postalCode')?.valueChanges.subscribe((value: string) => {
			// Remove caracteres não numéricos caso o usuário cole algo com máscara
			const cleanPostalCode = value?.replace(/\D/g, '');

			// Verifica se atingiu os 8 dígitos do CEP brasileiro
			if (cleanPostalCode?.length === 8) {
				this.searchResidence(cleanPostalCode);
			}
		});
	}

    searchResidence(postalCode: string): void {
		const postalCodeNumber = Number(postalCode);

		this.usersService.searchPostalCode(postalCodeNumber)
			.then(fullAddress => {
				if (fullAddress?.erro == 'true') {
					console.error({
							message: "[ERRO]: CEP ínválido, digite novamente!",
					});
				} else {
					this.registerForm.patchValue({
						state: fullAddress.uf,
						city: fullAddress.localidade,
						neighborhood: fullAddress.bairro,
						street: fullAddress.logradouro
					});

					this.changeDetector.detectChanges();
				}				
			})
			.catch(error => {
				console.error({
					message: "[ERRO]: Não foi possível buscar o CEP.",
					fail: error
				});
			});
	}

    public updatingProfileUser(): void {
        this.usersService.updateUser(this.registerForm.value)
            .then(result => {
                console.log(result);
                
                this.registerForm.reset();
                this.changeDetector.detectChanges();
                this.diaalogRef.close();
            }) 
            .catch (error => {
                console.error({
                    message: "[ERRO]: Não foi possível criar novo Usuário.",
                    fail: error
                });
            });
    }

    public closeDialog(): void {
        this.diaalogRef.close();
    }

    public changeHidePassword(event: MouseEvent): void {
        this.hidePassword.set(!this.hidePassword());
        event.stopPropagation();
    }
}