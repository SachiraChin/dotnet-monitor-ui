import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracePostComponent } from './trace-post.component';

describe('TracePostComponent', () => {
  let component: TracePostComponent;
  let fixture: ComponentFixture<TracePostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracePostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
