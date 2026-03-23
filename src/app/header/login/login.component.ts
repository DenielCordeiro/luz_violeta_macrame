import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StartComponent } from './start/start.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  loginDialog(): void {
    this.dialog.open<StartComponent>(StartComponent);
  }
}
