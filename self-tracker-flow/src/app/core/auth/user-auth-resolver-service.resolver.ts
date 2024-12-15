import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from '../api/user.service';
import { User as AuthUser } from '@angular/fire/auth';
import { User } from '../../shared/models/user';

export const userAuthResolverServiceResolver: ResolveFn<User | null> = () => {
  const authService = inject(AuthService);
  const userService = inject(UserService);

  return authService.getAuthUser().pipe(
    switchMap((user: AuthUser | null) => {
      if (!user) {
        return of(null);
      }

      return userService.getUser(user.uid);
    }),
  );
};
