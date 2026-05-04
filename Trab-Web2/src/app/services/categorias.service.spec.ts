import { TestBed } from '@angular/core/testing';
import { CategoriasService } from './categorias.service';
import { Categoria } from '../shared/models/categoria.model';

describe('CategoriasService', () => {
  let service: CategoriasService;

  // Antes de cada teste: cria instância limpa e limpa o localStorage
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriasService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  // ── Criação ────────────────────────────────────────────
  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  // ── listarTodos ────────────────────────────────────────
  describe('listarTodos()', () => {
    it('deve retornar lista vazia quando não há categorias', () => {
      expect(service.listarTodos()).toEqual([]);
    });

    it('deve retornar as categorias salvas no localStorage', () => {
      const c = new Categoria(1, 'Notebook');
      localStorage.setItem('categorias', JSON.stringify([c]));

      const resultado = service.listarTodos();
      expect(resultado.length).toBe(1);
      expect(resultado[0].nome).toBe('Notebook');
    });
  });

  // ── inserir ────────────────────────────────────────────
  describe('inserir()', () => {
    it('deve inserir uma categoria e gerar id automático', () => {
      service.inserir(new Categoria(0, 'Desktop'));

      const lista = service.listarTodos();
      expect(lista.length).toBe(1);
      expect(lista[0].nome).toBe('Desktop');
      expect(lista[0].id).toBeGreaterThan(0); // id gerado pelo Date.getTime()
    });

    it('deve manter categorias existentes ao inserir nova', () => {
      service.inserir(new Categoria(0, 'Impressora'));
      service.inserir(new Categoria(0, 'Mouse'));

      expect(service.listarTodos().length).toBe(2);
    });

    it('deve permitir inserir categorias com nomes distintos', () => {
      service.inserir(new Categoria(0, 'Teclado'));
      service.inserir(new Categoria(0, 'Monitor'));

      const nomes = service.listarTodos().map(c => c.nome);
      expect(nomes).toContain('Teclado');
      expect(nomes).toContain('Monitor');
    });
  });

  // ── buscarPorId ────────────────────────────────────────
  describe('buscarPorId()', () => {
    it('deve retornar a categoria com o id informado', () => {
      service.inserir(new Categoria(0, 'Webcam'));
      const id = service.listarTodos()[0].id;

      const resultado = service.buscarPorId(id);
      expect(resultado).toBeDefined();
      expect(resultado!.nome).toBe('Webcam');
    });

    it('deve retornar undefined para id inexistente', () => {
      expect(service.buscarPorId(99999)).toBeUndefined();
    });
  });

  // ── atualizar ──────────────────────────────────────────
  describe('atualizar()', () => {
    it('deve atualizar o nome da categoria existente', () => {
      service.inserir(new Categoria(0, 'Roteador'));
      const id = service.listarTodos()[0].id;

      service.atualizar(new Categoria(id, 'Roteador Wi-Fi'));

      expect(service.buscarPorId(id)!.nome).toBe('Roteador Wi-Fi');
    });

    it('não deve alterar outras categorias ao atualizar uma', () => {
      service.inserir(new Categoria(0, 'Scanner'));
      service.inserir(new Categoria(0, 'Projetor'));

      const lista = service.listarTodos();
      service.atualizar(new Categoria(lista[0].id, 'Scanner Portátil'));

      expect(service.buscarPorId(lista[1].id)!.nome).toBe('Projetor');
    });
  });

  // ── remover ────────────────────────────────────────────
  describe('remover()', () => {
    it('deve remover a categoria com o id informado', () => {
      service.inserir(new Categoria(0, 'HD Externo'));
      const id = service.listarTodos()[0].id;

      service.remover(id);
      expect(service.listarTodos().length).toBe(0);
    });

    it('não deve remover outras categorias ao remover uma', () => {
      service.inserir(new Categoria(0, 'Pendrive'));
      service.inserir(new Categoria(0, 'SSD'));

      const id1 = service.listarTodos()[0].id;
      service.remover(id1);

      const restante = service.listarTodos();
      expect(restante.length).toBe(1);
      expect(restante[0].nome).toBe('SSD');
    });

    it('não deve lançar erro ao tentar remover id inexistente', () => {
      expect(() => service.remover(99999)).not.toThrow();
    });
  });
});