import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatePasswordDialogComponent } from './certificate-password-dialog.component';

describe('CertificatePasswordDialogComponent', () => {
  let component: CertificatePasswordDialogComponent;
  let fixture: ComponentFixture<CertificatePasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatePasswordDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
