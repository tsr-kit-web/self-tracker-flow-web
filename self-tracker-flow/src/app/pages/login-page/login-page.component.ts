import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'stf-login-page',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  async signInWithGoogle(): Promise<void> {
    const isSignInSuccess = await this.authService.signInWithGoogle();

    if (!isSignInSuccess) {
      console.error('SignIn failed');
      return;
    }

    this.router.navigate(['/tracker']);
  }

  async signOutUser(): Promise<void> {
    const isSingOutSuccess = await this.authService.signOutUser();

    if (!isSingOutSuccess) {
      console.error('Sign out failed');
      return;
    }

    this.snackBar.open('Logged out successfully!', undefined, {
      duration: 2000,
    });

    this.router.navigate(['/login']);
  }
}
