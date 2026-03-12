import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaAutocadastro } from './tela-autocadastro';

describe('TelaAutocadastro', () => {
  let component: TelaAutocadastro;
  let fixture: ComponentFixture<TelaAutocadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaAutocadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaAutocadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
