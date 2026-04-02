import { ChangeDetectorRef, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

import { Address } from 'src/app/interfaces/address.interface';
import { UsersService } from 'src/app/services/users/users.service';

import { brasilStates } from './register.mock';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatButtonModule,
		MatFormField,
		MatLabel,
		MatInputModule,
		MatDividerModule,
		MatSelectModule
	],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit {
	registerForm!: FormGroup;
	hidePassword: WritableSignal<boolean> = signal(true);
	stateControl = new FormControl('SP');
	states: string[] = brasilStates;
	groupInfosAddress: string[] = [];
	addressData!: Address;
	convertedAddress: string | undefined;

	constructor(
		private formBuilder: FormBuilder,
		private usersService: UsersService,
		public route: ActivatedRoute,
		private changeDetector: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.buildingForm();
		this.postalCodeObserver();
	}

	buildingForm(): void {
		this.registerForm = this.formBuilder.group({
			"name": [null, Validators.required],
			"email": [null, [Validators.required, Validators.email]],
			"password": [null, Validators.required],
			"cellphone": null,
			"postalCode": null,
			"state": null,
			"city": null,
			"neighborhood": null,
			"street": null,
			"houseNumber": null,
		});
	}

	makeRegister() {
		this.getResidence();

		if (this.registerForm.valid) {
			this.usersService.createUser(this.registerForm.value);
			this.registerForm.reset();
		} else {
			console.log(this.registerForm);
		}
	}

	changeHidePassword(event: MouseEvent): void {
        this.hidePassword.set(!this.hidePassword());
        event.stopPropagation();
    }

	getResidence(): void {
		this.searchResidence(this.registerForm.value.postalCode);
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
				console.log("Endereço completo, buscado da API: ", fullAddress);

				this.registerForm.patchValue({
					state: fullAddress.uf,
					city: fullAddress.localidade,
					neighborhood: fullAddress.bairro,
					street: fullAddress.logradouro
				});

				this.changeDetector.detectChanges();
			})
			.catch(error => {
				console.error({
					message: "[ERRO]: Não foi possível buscar o CEP!",
					fail: error
				});
			});
	}
}
