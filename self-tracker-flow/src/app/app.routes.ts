import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layouts/layout/layout.component';
import { userAuthResolverServiceResolver } from './core/auth/user-auth-resolver-service.resolver';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    resolve: { user: userAuthResolverServiceResolver },
    runGuardsAndResolvers: 'always',
    children: [
      { path: '', redirectTo: 'tracker', pathMatch: 'full' },
      {
        path: 'tracker',
        title: 'tracker',
        loadComponent: () =>
          import('./pages/tracker-page/tracker-page.component').then(
            (c) => c.TrackerPageComponent,
          ),
      },
    ],
  },
  {
    path: 'login',
    title: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (c) => c.LoginPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
