import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagFuncionario } from './pag-funcionario';

describe('PagFuncionario', () => {
  let component: PagFuncionario;
  let fixture: ComponentFixture<PagFuncionario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagFuncionario],
    }).compileComponents();

    fixture = TestBed.createComponent(PagFuncionario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
