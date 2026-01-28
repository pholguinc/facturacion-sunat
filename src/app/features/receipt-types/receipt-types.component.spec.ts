import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptTypesComponent } from './receipt-types.component';

describe('ReceiptTypesComponent', () => {
  let component: ReceiptTypesComponent;
  let fixture: ComponentFixture<ReceiptTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
