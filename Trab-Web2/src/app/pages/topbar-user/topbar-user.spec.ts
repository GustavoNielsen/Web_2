import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarUser } from './topbar-user';

describe('TopbarUser', () => {
  let component: TopbarUser;
  let fixture: ComponentFixture<TopbarUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarUser],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
