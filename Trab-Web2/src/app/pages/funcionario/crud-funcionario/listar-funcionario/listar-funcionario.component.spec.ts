/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarFuncionarioComponent } from './listar-funcionario.component';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { Funcionario } from '../../../../shared/models/funcionario.model';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

// ── Mock do FuncionarioService ─────────────────────────
// Usamos um spy object para não depender do localStorage nos testes de componente.
// Cada método é substituído por um jasmine.Spy controlável por teste.
const mockFuncionarioService = {
  listarTodos: jasmine.createSpy('listarTodos').and.returnValue([]),
  remover: jasmine.createSpy('remover'),
};

// ── Dados de exemplo reutilizáveis ─────────────────────
const funcionariosMock: Funcionario[] = [
  new Funcionario(1, 'maria@email.com', 'Maria Silva', new Date('1990-05-10'), '1234'),
  new Funcionario(2, 'mario@email.com', 'Mario Santos', new Date('1985-03-22'), '5678'),
];

describe('ListarFuncionarioComponent', () => {
  let component: ListarFuncionarioComponent;
  let fixture: ComponentFixture<ListarFuncionarioComponent>;

  beforeEach(async () => {
    // Resetar spies antes de cada teste para evitar contaminação entre eles
    mockFuncionarioService.listarTodos.calls.reset();
    mockFuncionarioService.remover.calls.reset();
    mockFuncionarioService.listarTodos.and.returnValue([]);

    await TestBed.configureTestingModule({
      imports: [ListarFuncionarioComponent, RouterTestingModule],
      providers: [
        { provide: FuncionarioService, useValue: mockFuncionarioService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Criação ───────────────────────────────────────────
  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  // ── ngOnInit ──────────────────────────────────────────
  describe('ngOnInit()', () => {
    it('deve chamar listarTodos() ao inicializar', () => {
      expect(mockFuncionarioService.listarTodos).toHaveBeenCalled();
    });

    it('deve preencher a lista de funcionários com o retorno do serviço', async () => {
      mockFuncionarioService.listarTodos.and.returnValue(funcionariosMock);

      // Recriar o componente para disparar ngOnInit com o novo retorno
      fixture = TestBed.createComponent(ListarFuncionarioComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.funcionarios.length).toBe(2);
      expect(component.funcionarios[0].nome).toBe('Maria Silva');
    });

    it('deve iniciar com lista vazia quando o serviço não retorna dados', () => {
      expect(component.funcionarios.length).toBe(0);
    });
  });

  // ── Template ──────────────────────────────────────────
  describe('Renderização do template', () => {
    beforeEach(async () => {
      mockFuncionarioService.listarTodos.and.returnValue(funcionariosMock);
      fixture = TestBed.createComponent(ListarFuncionarioComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('deve renderizar uma linha na tabela para cada funcionário', () => {
      const linhas = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(linhas.length).toBe(2);
    });

    it('deve exibir o nome do funcionário na tabela', () => {
      const celulas = fixture.debugElement.queryAll(By.css('tbody tr td'));
      expect(celulas[0].nativeElement.textContent).toContain('Maria Silva');
    });

    it('deve exibir o e-mail do funcionário na tabela', () => {
      const celulas = fixture.debugElement.queryAll(By.css('tbody tr td'));
      expect(celulas[1].nativeElement.textContent).toContain('maria@email.com');
    });

    it('deve exibir botões de Editar e Remover para cada funcionário', () => {
      const botoes = fixture.debugElement.queryAll(By.css('tbody tr td a'));
      // 2 funcionários × 2 botões = 4 elementos
      expect(botoes.length).toBe(4);
    });

    it('deve exibir o badge com a contagem total de funcionários', () => {
      const badge = fixture.debugElement.query(By.css('.badge'));
      expect(badge.nativeElement.textContent.trim()).toBe('2');
    });
  });

  // ── Template vazio ────────────────────────────────────
  describe('Renderização com lista vazia', () => {
    it('deve exibir alerta quando não há funcionários', () => {
      mockFuncionarioService.listarTodos.and.returnValue([]);
      fixture.detectChanges();

      const alerta = fixture.debugElement.query(By.css('.alert-warning'));
      expect(alerta).toBeTruthy();
    });
  });

  // ── remover ───────────────────────────────────────────
  describe('remover()', () => {
    beforeEach(() => {
      mockFuncionarioService.listarTodos.and.returnValue([...funcionariosMock]);
      component.funcionarios = [...funcionariosMock];
    });

    it('deve chamar remover() no serviço ao confirmar', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockFuncionarioService.listarTodos.and.returnValue([funcionariosMock[1]]);

      const evento = { preventDefault: jasmine.createSpy() } as any;
      component.remover(evento, funcionariosMock[0]);

      expect(mockFuncionarioService.remover).toHaveBeenCalledWith(1);
    });

    it('deve chamar preventDefault() para evitar o comportamento padrão do link', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const evento = { preventDefault: jasmine.createSpy() } as any;

      component.remover(evento, funcionariosMock[0]);

      expect(evento.preventDefault).toHaveBeenCalled();
    });

    it('não deve chamar remover() no serviço ao cancelar o confirm()', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const evento = { preventDefault: jasmine.createSpy() } as any;

      component.remover(evento, funcionariosMock[0]);

      expect(mockFuncionarioService.remover).not.toHaveBeenCalled();
    });

    it('deve atualizar a lista após remover', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockFuncionarioService.listarTodos.and.returnValue([funcionariosMock[1]]);

      const evento = { preventDefault: jasmine.createSpy() } as any;
      component.remover(evento, funcionariosMock[0]);

      expect(component.funcionarios.length).toBe(1);
      expect(component.funcionarios[0].nome).toBe('Mario Santos');
    });
  });
});
