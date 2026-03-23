import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Address } from 'src/app/interfaces/address.interface';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  convertedAddress: string | undefined;
  groupInfosAddress: string[] = [];
  nextForm: boolean = false;
  addressData!: Address;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.buildingForm();
  }

  buildingForm(): void {
    this.registerForm = this.formBuilder.group({
      "name": [null, Validators.required],
      "email": [null, [Validators.required, Validators.email]],
      "password": [null, Validators.required],
      "cellphone": [null, Validators.required],
      "postalCode": [null, Validators.required],
      "state": [null, Validators.required],
      "city": [null, Validators.required],
      "neighborhood": [null, Validators.required],
      "street": [null, Validators.required],
      "houseNumber": [null, Validators.required],
    });
  }

  makeRegister() {
    this.getResidence();

    if(this.registerForm.valid) {
      this.usersService.createUser(this.registerForm.value);
      this.registerForm.reset();
    } else {
      console.log(this.registerForm);
    }
  }

  getResidence(): void {
    this.searchResidence(this.registerForm.value.postalCode);
  }

  searchResidence(postalCode: string): void {
    let postalCodeNumber = Number(postalCode);
    let state = document.querySelector('#state') as HTMLInputElement;
    let city = document.querySelector('#city') as HTMLInputElement;
    let bairro = document.querySelector('#neighborhood') as HTMLInputElement;
    let logradouro = document.querySelector('#street') as HTMLInputElement;

    if (postalCode != null) {
      this.usersService.searchPostalCode(postalCodeNumber)
        .then(result => {
          this.addressData = result;
          this.registerForm.value.state = this.addressData.uf;
          this.registerForm.value.city = this.addressData.localidade;
          this.registerForm.value.neighborhood = this.addressData.bairro;
          this.registerForm.value.street = this.addressData.logradouro;

          state.value = this.addressData.uf ? this.addressData.uf : '';
          city.value = this.addressData.localidade ? this.addressData.localidade : '';
          bairro.value = this.addressData.bairro ? this.addressData.bairro : '';
          logradouro.value = this.addressData.logradouro ? this.addressData.logradouro : '';
        })
    } else {
      alert('Você não insiriu nenhum número de CEP.')
    }
  }

  formAdvance(): boolean {
    return this.nextForm = !this.nextForm;
  }
}
