import { TestBed, inject } from '@angular/core/testing';

import { MsAdalAngular6Service } from './ms-adal-angular6.service';

describe('MsAdalAngular6Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsAdalAngular6Service]
    });
  });

  it('should be created', inject([MsAdalAngular6Service], (service: MsAdalAngular6Service) => {
    expect(service).toBeTruthy();
  }));
});
