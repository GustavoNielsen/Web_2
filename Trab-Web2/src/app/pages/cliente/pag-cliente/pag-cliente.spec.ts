import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagCliente } from './pag-cliente';

describe('PagCliente', () => {
  let component: PagCliente;
  let fixture: ComponentFixture<PagCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(PagCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
