import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelOrcamentoComponent } from './painel-orcamento.component';

describe('PainelOrcamentoComponent', () => {
  let component: PainelOrcamentoComponent;
  let fixture: ComponentFixture<PainelOrcamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelOrcamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelOrcamentoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
