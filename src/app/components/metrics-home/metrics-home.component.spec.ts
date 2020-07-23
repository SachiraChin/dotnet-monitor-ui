import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsHomeComponent } from './metrics-home.component';

describe('MetricsHomeComponent', () => {
  let component: MetricsHomeComponent;
  let fixture: ComponentFixture<MetricsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
