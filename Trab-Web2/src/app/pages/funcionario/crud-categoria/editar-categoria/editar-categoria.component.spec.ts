import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarCategoriaComponent } from './editar-categoria.component';
import { CategoriasService } from '../../../../services/categorias.service';
import { Categoria } from '../../../../shared/models/categoria.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

// ── Dados de exemplo ───────────────────────────────────
const categoriaMock = new Categoria(1, 'Notebook');

describe('EditarCategoriaComponent', () => {
  let component: EditarCategoriaComponent;
  let fixture: ComponentFixture<EditarCategoriaComponent>;
  let mockCategoriasService: jasmine.SpyObj<CategoriasService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Cria os spies dentro do beforeEach para instância nova a cada teste
    mockCategoriasService = jasmine.createSpyObj('CategoriasService', [
      'buscarPorId',
      'atualizar',
      'listarTodos',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Por padrão retorna a categoria mock ao buscar pelo id
    mockCategoriasService.buscarPorId.and.returnValue(categoriaMock);

    await TestBed.configureTestingModule({
      imports: [EditarCategoriaComponent, RouterTestingModule, FormsModule, CommonModule],
      providers: [
        { provide: CategoriasService, useValue: mockCategoriasService },
        { provide: Router, useValue: mockRouter },
        {
          // Simula a rota com id = 1, igual ao que o Angular passa via URL
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  // ── Criação ───────────────────────────────────────────
  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  // ── ngOnInit ──────────────────────────────────────────
  describe('ngOnInit()', () => {
    it('deve buscar a categoria pelo id da rota', () => {
      expect(mockCategoriasService.buscarPorId).toHaveBeenCalledWith(1);
    });

    it('deve preencher a categoria com os dados retornados pelo serviço', () => {
      expect(component.categoria.nome).toBe('Notebook');
      expect(component.categoria.id).toBe(1);
    });

    it('deve lançar erro quando a categoria não for encontrada', () => {
      mockCategoriasService.buscarPorId.and.returnValue(undefined);

      // Recriar o componente para disparar ngOnInit com undefined
      fixture = TestBed.createComponent(EditarCategoriaComponent);
      component = fixture.componentInstance;

      expect(() => fixture.detectChanges()).toThrowError(
        'Categoria não encontrada: id = 1'
      );
    });
  });

  // ── atualizar ─────────────────────────────────────────
  describe('atualizar()', () => {
    it('deve chamar atualizar() no serviço quando formulário válido', async () => {
      // Preenche o campo nome para o formulário ficar válido
      component.categoria.nome = 'Notebook Gamer';
      fixture.detectChanges();
      await fixture.whenStable();

      component.atualizar();

      expect(mockCategoriasService.atualizar).toHaveBeenCalledWith(
        jasmine.objectContaining({ id: 1, nome: 'Notebook Gamer' })
      );
    });

    it('deve navegar para /funcionario/equipamento após atualizar', async () => {
      component.categoria.nome = 'Desktop';
      fixture.detectChanges();
      await fixture.whenStable();

      component.atualizar();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/funcionario/equipamento']);
    });

    it('não deve chamar atualizar() quando formulário inválido', async () => {
      // Esvazia o nome para tornar o formulário inválido
      component.categoria.nome = '';
      fixture.detectChanges();
      await fixture.whenStable();

      component.atualizar();

      expect(mockCategoriasService.atualizar).not.toHaveBeenCalled();
    });

    it('não deve navegar quando formulário inválido', async () => {
      component.categoria.nome = '';
      fixture.detectChanges();
      await fixture.whenStable();

      component.atualizar();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  // ── Template ──────────────────────────────────────────
  describe('Renderização do template', () => {
    it('deve exibir o campo de nome preenchido com o valor atual', async () => {
      const input = fixture.debugElement.query(By.css('input[name="nome"]'));
      expect(input.nativeElement.value).toBe('Notebook');
    });

    it('deve exibir o botão de Salvar Alterações', () => {
      const botao = fixture.debugElement.query(By.css('button[type="button"]'));
      expect(botao).toBeTruthy();
      expect(botao.nativeElement.textContent).toContain('Salvar');
    });

    it('deve exibir o link de Voltar para a lista', () => {
      const link = fixture.debugElement.query(By.css('a[routerLink]'));
      expect(link).toBeTruthy();
      expect(link.nativeElement.textContent).toContain('Voltar');
    });

    it('deve exibir preview do nome quando campo tem ao menos 2 caracteres', async () => {
      component.categoria.nome = 'Impressora';
      fixture.detectChanges();
      await fixture.whenStable();

      const preview = fixture.debugElement.query(By.css('.alert-info'));
      expect(preview).toBeTruthy();
      expect(preview.nativeElement.textContent).toContain('Impressora');
    });
  });
});
