import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from '../api/user.service';

export const userAuthResolverServiceResolver: ResolveFn<any | null> = (route, state) => {

  const authService = inject(AuthService);
  const userService = inject(UserService);

  return authService.getAuthUser().pipe(
    switchMap((user: any) => {
      if (!user) {
        return of(null);
      }

      return userService.getUser(user.uid);
    })
  );
};