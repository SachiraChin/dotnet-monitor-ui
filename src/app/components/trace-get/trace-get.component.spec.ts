import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceGetComponent } from './trace-get.component';

describe('TraceGetComponent', () => {
  let component: TraceGetComponent;
  let fixture: ComponentFixture<TraceGetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceGetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
