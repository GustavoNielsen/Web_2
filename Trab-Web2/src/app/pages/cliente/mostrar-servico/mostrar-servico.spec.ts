import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarServico } from './mostrar-servico';

describe('MostrarServico', () => {
  let component: MostrarServico;
  let fixture: ComponentFixture<MostrarServico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarServico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarServico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
