import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirecionarSolicitacao } from './redirecionar-solicitacao';

describe('RedirecionarSolicitcao', () => {
  let component: RedirecionarSolicitacao;
  let fixture: ComponentFixture<RedirecionarSolicitacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirecionarSolicitacao],
    }).compileComponents();

    fixture = TestBed.createComponent(RedirecionarSolicitacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
