import { Injectable } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../api/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private auth: Auth,
    private userService: UserService,
  ) {
    this.setupAuthStateListener();
  }

  private setupAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  isUserAuth(): boolean {
    return !!this.currentUserSubject.value;
  }

  async signInWithGoogle(): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    return this.processUserLogin(provider);
  }

  async signInWithGithub(): Promise<boolean> {
    const provider = new GithubAuthProvider();
    return this.processUserLogin(provider);
  }

  async processUserLogin(
    provider: GoogleAuthProvider | GithubAuthProvider,
  ): Promise<boolean> {
    try {
      const result: UserCredential = await signInWithPopup(this.auth, provider);
      const user = result.user;

      if (user) {
        await this.userService.addUser(user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  getAuthUser(): Observable<User> {
    return user(this.auth);
  }

  async signOutUser(): Promise<boolean> {
    try {
      await this.auth.signOut();

      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }
}
