import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorHomeComponent } from './monitor-home.component';

describe('MonitorHomeComponent', () => {
  let component: MonitorHomeComponent;
  let fixture: ComponentFixture<MonitorHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
