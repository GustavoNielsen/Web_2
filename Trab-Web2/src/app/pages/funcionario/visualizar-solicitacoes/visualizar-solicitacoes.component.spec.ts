import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarSolicitacoesComponent } from './visualizar-solicitacoes.component';

describe('VisualizarSolicitacoesComponent', () => {
  let component: VisualizarSolicitacoesComponent;
  let fixture: ComponentFixture<VisualizarSolicitacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarSolicitacoesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarSolicitacoesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
