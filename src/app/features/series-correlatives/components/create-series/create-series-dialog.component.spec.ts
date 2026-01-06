import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSeriesDialogComponent } from './create-series-dialog.component';

describe('CreateSeriesComponent', () => {
  let component: CreateSeriesDialogComponent;
  let fixture: ComponentFixture<CreateSeriesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSeriesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSeriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
