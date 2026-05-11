import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarCategoriaComponent } from './listar-categoria.component';
import { CategoriasService } from '../../../../services/categorias.service';
import { Categoria } from '../../../../shared/models/categoria.model';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

// ── Mock do CategoriasService ──────────────────────────
// Usamos um spy object para não depender do localStorage nos testes de componente.
const mockCategoriasService = {
  listarTodos: jasmine.createSpy('listarTodos').and.returnValue([]),
  remover: jasmine.createSpy('remover'),
};

// ── Dados de exemplo reutilizáveis ─────────────────────
const categoriasMock: Categoria[] = [
  new Categoria(1, 'Notebook'),
  new Categoria(2, 'Impressora'),
  new Categoria(3, 'Desktop'),
];

describe('ListarCategoriaComponent', () => {
  let component: ListarCategoriaComponent;
  let fixture: ComponentFixture<ListarCategoriaComponent>;

  beforeEach(async () => {
    // Resetar spies antes de cada teste
    mockCategoriasService.listarTodos.calls.reset();
    mockCategoriasService.remover.calls.reset();
    mockCategoriasService.listarTodos.and.returnValue([]);

    await TestBed.configureTestingModule({
      imports: [ListarCategoriaComponent, RouterTestingModule],
      providers: [
        { provide: CategoriasService, useValue: mockCategoriasService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarCategoriaComponent);
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
      expect(mockCategoriasService.listarTodos).toHaveBeenCalled();
    });

    it('deve preencher a lista de categorias com o retorno do serviço', async () => {
      mockCategoriasService.listarTodos.and.returnValue(categoriasMock);

      fixture = TestBed.createComponent(ListarCategoriaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.categorias.length).toBe(3);
      expect(component.categorias[0].nome).toBe('Notebook');
    });

    it('deve iniciar com lista vazia quando o serviço não retorna dados', () => {
      expect(component.categorias.length).toBe(0);
    });
  });

  // ── Template ──────────────────────────────────────────
  describe('Renderização do template', () => {
    beforeEach(async () => {
      mockCategoriasService.listarTodos.and.returnValue(categoriasMock);
      fixture = TestBed.createComponent(ListarCategoriaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('deve renderizar uma linha para cada categoria', () => {
      const linhas = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(linhas.length).toBe(3);
    });

    it('deve exibir o nome da categoria na tabela', () => {
      const celulas = fixture.debugElement.queryAll(By.css('tbody tr td'));
      expect(celulas[0].nativeElement.textContent).toContain('Notebook');
    });

    it('deve exibir botões de Editar e Remover para cada categoria', () => {
      const botoes = fixture.debugElement.queryAll(By.css('tbody tr td a'));
      // 3 categorias × 2 botões = 6 elementos
      expect(botoes.length).toBe(6);
    });

    it('deve exibir o badge com a contagem total de categorias', () => {
      const badge = fixture.debugElement.query(By.css('.badge'));
      expect(badge.nativeElement.textContent.trim()).toBe('3');
    });
  });

  // ── Template vazio ────────────────────────────────────
  describe('Renderização com lista vazia', () => {
    it('deve exibir alerta quando não há categorias', () => {
      mockCategoriasService.listarTodos.and.returnValue([]);
      fixture.detectChanges();

      const alerta = fixture.debugElement.query(By.css('.alert-warning'));
      expect(alerta).toBeTruthy();
    });
  });

  // ── remover ───────────────────────────────────────────
  describe('remover()', () => {
    beforeEach(() => {
      component.categorias = [...categoriasMock];
    });

    it('deve chamar remover() no serviço ao confirmar', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockCategoriasService.listarTodos.and.returnValue([categoriasMock[1], categoriasMock[2]]);

      const evento = { preventDefault: jasmine.createSpy() } as any;
      component.remover(evento, categoriasMock[0]);

      expect(mockCategoriasService.remover).toHaveBeenCalledWith(1);
    });

    it('deve chamar preventDefault() para evitar o comportamento padrão do link', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const evento = { preventDefault: jasmine.createSpy() } as any;

      component.remover(evento, categoriasMock[0]);

      expect(evento.preventDefault).toHaveBeenCalled();
    });

    it('não deve chamar remover() no serviço ao cancelar o confirm()', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const evento = { preventDefault: jasmine.createSpy() } as any;

      component.remover(evento, categoriasMock[0]);

      expect(mockCategoriasService.remover).not.toHaveBeenCalled();
    });

    it('deve atualizar a lista após remover', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockCategoriasService.listarTodos.and.returnValue([categoriasMock[1], categoriasMock[2]]);

      const evento = { preventDefault: jasmine.createSpy() } as any;
      component.remover(evento, categoriasMock[0]);

      expect(component.categorias.length).toBe(2);
      expect(component.categorias[0].nome).toBe('Impressora');
    });

    it('deve exibir mensagem de confirmação com o nome da categoria', () => {
      const confirmSpy = spyOn(window, 'confirm').and.returnValue(false);
      const evento = { preventDefault: jasmine.createSpy() } as any;

      component.remover(evento, categoriasMock[0]);

      expect(confirmSpy).toHaveBeenCalledWith(
        'Deseja realmente remover a categoria Notebook?'
      );
    });
  });
});
