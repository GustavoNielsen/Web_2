import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovarServico } from './aprovar-servico';

describe('AprovarServico', () => {
  let component: AprovarServico;
  let fixture: ComponentFixture<AprovarServico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprovarServico],
    }).compileComponents();

    fixture = TestBed.createComponent(AprovarServico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
