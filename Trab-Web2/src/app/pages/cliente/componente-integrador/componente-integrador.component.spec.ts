import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteIntegradorComponent } from './componente-integrador.component';

describe('ComponenteIntegradorComponent', () => {
  let component: ComponenteIntegradorComponent;
  let fixture: ComponentFixture<ComponenteIntegradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteIntegradorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteIntegradorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
