import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlaReport } from './mla-report';

describe('MlaReport', () => {
  let component: MlaReport;
  let fixture: ComponentFixture<MlaReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlaReport],
    }).compileComponents();

    fixture = TestBed.createComponent(MlaReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
