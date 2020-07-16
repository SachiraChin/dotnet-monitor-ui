import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcDumpComponent } from './gc-dump.component';

describe('GcDumpComponent', () => {
  let component: GcDumpComponent;
  let fixture: ComponentFixture<GcDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
