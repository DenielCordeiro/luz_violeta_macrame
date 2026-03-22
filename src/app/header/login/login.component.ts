import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule,  } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StartComponent } from './start/start.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
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

  async makeLogin() {
    try{
      if (this.loginForm.valid) {
        // await this.userService.authUser(this.loginForm.value);
        this.closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  }

  loginDialog(): void {
    this.dialog.open<StartComponent>(StartComponent);
  }

  closeModal(): void {}
}
