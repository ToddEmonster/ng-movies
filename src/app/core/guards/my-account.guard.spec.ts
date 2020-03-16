import { TestBed } from '@angular/core/testing';

import { MyAccountGuard } from './my-account.guard';

describe('MyAccountGuard', () => {
  let guard: MyAccountGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MyAccountGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
