import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'signInWithGoogle',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should navigate to /tracker on successful sign-in', async () => {
    authService.signInWithGoogle.and.returnValue(Promise.resolve(true));

    await component.signInWithGoogle();

    expect(authService.signInWithGoogle).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/tracker']);
  });

  it('should log an error and not navigate on failed sign-in', async () => {
    spyOn(console, 'error');
    authService.signInWithGoogle.and.returnValue(Promise.resolve(false));

    await component.signInWithGoogle();

    expect(authService.signInWithGoogle).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('SignIn failed');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
