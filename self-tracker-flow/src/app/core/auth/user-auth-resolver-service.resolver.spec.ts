import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userAuthResolverServiceResolver } from './user-auth-resolver-service.resolver';

describe('userAuthResolverServiceResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => userAuthResolverServiceResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
