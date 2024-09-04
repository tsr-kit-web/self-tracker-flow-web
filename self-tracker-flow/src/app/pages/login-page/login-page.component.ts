import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'stf-login-page',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
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

    this.router.navigate(['/login']);
  }
}
