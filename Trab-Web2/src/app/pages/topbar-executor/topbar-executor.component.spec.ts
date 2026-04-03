import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarExecutorComponent } from './topbar-executor.component';

describe('TopbarExecutorComponent', () => {
  let component: TopbarExecutorComponent;
  let fixture: ComponentFixture<TopbarExecutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarExecutorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarExecutorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
