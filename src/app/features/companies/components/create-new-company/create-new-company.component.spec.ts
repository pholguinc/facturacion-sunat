import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewCompanyComponent } from './create-new-company.component';

describe('CreateNewCompanyComponent', () => {
  let component: CreateNewCompanyComponent;
  let fixture: ComponentFixture<CreateNewCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
