// login.component.ts
import { Component } from '@angular/core';
import { ApiService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  login() {
    const data = { username: this.username, password: this.password };
    this.apiService.login(data).subscribe(
      response => {
        console.log('Login Response:', response);

        // Open a dialog to inform the user about successful login
        this.dialog.open(DialogComponent, {
          data: { message: 'Login successful!' }
        });

        // Redirect to the upload-image page after successful login
        this.router.navigate(['/upload-image']);
      },
      error => {
        console.error('Login Error:', error);

        // Open a dialog to inform the user about the login failure
        this.dialog.open(DialogComponent, {
          data: { message: 'Login failed. Please check your credentials.' }
        });
      }
    );
  }
}
