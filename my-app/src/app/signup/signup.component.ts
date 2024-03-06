// signup.component.ts
import { Component } from '@angular/core';
import { ApiService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from "../dialog/dialog.component";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  password: string = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  signup() {
    const data = { username: this.username, password: this.password };
    this.apiService.signup(data).subscribe(
      response => {
        console.log('Signup Response:', response);

        // Open a dialog to inform the user about successful registration
        this.dialog.open(DialogComponent, {
          data: { message: 'User registered successfully!' }
        });

        // Redirect to the login page after successful registration
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Signup Error:', error);

        // Open a dialog to inform the user about the signup failure
        this.dialog.open(DialogComponent, {
          data: { message: 'Signup failed. Please try again.' }
        });
      }
    );
  }
}
