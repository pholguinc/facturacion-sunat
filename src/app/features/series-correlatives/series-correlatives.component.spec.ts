import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesCorrelativesComponent } from './series-correlatives.component';

describe('SeriesCorrelativesComponent', () => {
  let component: SeriesCorrelativesComponent;
  let fixture: ComponentFixture<SeriesCorrelativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesCorrelativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesCorrelativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
