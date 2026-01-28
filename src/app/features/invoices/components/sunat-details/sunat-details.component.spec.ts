import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunatDetailsComponent } from './sunat-details.component';

describe('SunatDetailsComponent', () => {
  let component: SunatDetailsComponent;
  let fixture: ComponentFixture<SunatDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SunatDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SunatDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
