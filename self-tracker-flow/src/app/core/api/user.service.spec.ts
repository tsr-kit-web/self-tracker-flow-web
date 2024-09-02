import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';

class MockFirestore {
  doc = jasmine.createSpy().and.callFake(() => {
    return {
      get: jasmine.createSpy().and.callFake(() =>
        of({
          exists: () => true,
          data: () => ({ uid: '123', name: 'John Doe' }),
        }),
      ),
    };
  });
}

describe('UserService', () => {
  let userService: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let firestore: Firestore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, { provide: Firestore, useClass: MockFirestore }],
    });

    userService = TestBed.inject(UserService);
    firestore = TestBed.inject(Firestore);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });
});
