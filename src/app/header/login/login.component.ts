import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StartComponent } from './start/start.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  imports: [RouterLink],
})
export class LoginComponent implements OnInit {
  refreshToken: string | null = null;
  isConnected: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.verifyIsConnected();
  }

  verifyIsConnected(): boolean {
    this.refreshToken = JSON.stringify(localStorage.getItem('refresh_token'));  

    if(this.refreshToken !== null) {
      return this.isConnected = true;
    } else {
      return this.isConnected = false;
    }
  }

  loginDialog(): void {
    this.dialog.open<StartComponent>(StartComponent);
  }
}
