import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarExecutor } from './navbar-executor';

describe('NavbarExecutor', () => {
  let component: NavbarExecutor;
  let fixture: ComponentFixture<NavbarExecutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarExecutor],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarExecutor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
