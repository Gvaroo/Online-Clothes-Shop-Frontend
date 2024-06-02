import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticateExternalComponent } from './authenticate-external.component';

describe('AuthenticateExternalComponent', () => {
  let component: AuthenticateExternalComponent;
  let fixture: ComponentFixture<AuthenticateExternalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthenticateExternalComponent]
    });
    fixture = TestBed.createComponent(AuthenticateExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
