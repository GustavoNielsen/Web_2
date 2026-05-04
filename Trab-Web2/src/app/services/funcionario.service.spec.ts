import { TestBed } from '@angular/core/testing';
import { FuncionarioService } from './funcionario.service';
import { Funcionario } from '../shared/models/funcionario.model';

describe('FuncionarioService', () => {
  let service: FuncionarioService;

  // Antes de cada teste: cria uma instância limpa do serviço
  // e limpa o localStorage para garantir isolamento entre testes
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionarioService);
    localStorage.clear();
  });

  // Garante que o localStorage continua limpo após cada teste
  afterEach(() => localStorage.clear());

  // ── Criação ────────────────────────────────────────────
  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  // ── listarTodos ────────────────────────────────────────
  describe('listarTodos()', () => {
    it('deve retornar lista vazia quando não há funcionários', () => {
      const resultado = service.listarTodos();
      expect(resultado).toEqual([]);
    });

    it('deve retornar os funcionários salvos no localStorage', () => {
      const f = new Funcionario(1, 'maria@email.com', 'Maria', new Date(), '1234');
      localStorage.setItem('funcionarios', JSON.stringify([f]));

      const resultado = service.listarTodos();
      expect(resultado.length).toBe(1);
      expect(resultado[0].nome).toBe('Maria');
    });
  });

  // ── inserir ────────────────────────────────────────────
  describe('inserir()', () => {
    it('deve inserir um funcionário e gerar id automático', () => {
      const f = new Funcionario(0, 'mario@email.com', 'Mario', new Date(), '4321');
      service.inserir(f);

      const lista = service.listarTodos();
      expect(lista.length).toBe(1);
      expect(lista[0].nome).toBe('Mario');
      expect(lista[0].id).toBeGreaterThan(0); // id gerado pelo Date.getTime()
    });

    it('deve manter funcionários existentes ao inserir novo', () => {
      const f1 = new Funcionario(0, 'a@email.com', 'Ana', new Date(), '0000');
      const f2 = new Funcionario(0, 'b@email.com', 'Bruno', new Date(), '1111');
      service.inserir(f1);
      service.inserir(f2);

      expect(service.listarTodos().length).toBe(2);
    });
  });

  // ── buscarPorId ────────────────────────────────────────
  describe('buscarPorId()', () => {
    it('deve retornar o funcionário com o id informado', () => {
      const f = new Funcionario(0, 'c@email.com', 'Carlos', new Date(), '2222');
      service.inserir(f);
      const id = service.listarTodos()[0].id;

      const resultado = service.buscarPorId(id);
      expect(resultado).toBeDefined();
      expect(resultado!.nome).toBe('Carlos');
    });

    it('deve retornar undefined para id inexistente', () => {
      expect(service.buscarPorId(99999)).toBeUndefined();
    });
  });

  // ── atualizar ──────────────────────────────────────────
  describe('atualizar()', () => {
    it('deve atualizar o nome do funcionário existente', () => {
      const f = new Funcionario(0, 'd@email.com', 'Diana', new Date(), '3333');
      service.inserir(f);
      const id = service.listarTodos()[0].id;

      const atualizado = new Funcionario(id, 'd@email.com', 'Diana Silva', new Date(), '3333');
      service.atualizar(atualizado);

      expect(service.buscarPorId(id)!.nome).toBe('Diana Silva');
    });

    it('não deve alterar outros funcionários ao atualizar um', () => {
      service.inserir(new Funcionario(0, 'e@email.com', 'Eduardo', new Date(), '4444'));
      service.inserir(new Funcionario(0, 'f@email.com', 'Fernanda', new Date(), '5555'));

      const lista = service.listarTodos();
      lista[0].nome = 'Eduardo Souza';
      service.atualizar(lista[0]);

      expect(service.buscarPorId(lista[1].id)!.nome).toBe('Fernanda');
    });
  });

  // ── remover ────────────────────────────────────────────
  describe('remover()', () => {
    it('deve remover o funcionário com o id informado', () => {
      service.inserir(new Funcionario(0, 'g@email.com', 'Gabriel', new Date(), '6666'));
      const id = service.listarTodos()[0].id;

      service.remover(id);
      expect(service.listarTodos().length).toBe(0);
    });

    it('não deve remover outros funcionários ao remover um', () => {
      service.inserir(new Funcionario(0, 'h@email.com', 'Helena', new Date(), '7777'));
      service.inserir(new Funcionario(0, 'i@email.com', 'Igor', new Date(), '8888'));

      const id1 = service.listarTodos()[0].id;
      service.remover(id1);

      const restante = service.listarTodos();
      expect(restante.length).toBe(1);
      expect(restante[0].nome).toBe('Igor');
    });

    it('não deve lançar erro ao remover id inexistente', () => {
      expect(() => service.remover(99999)).not.toThrow();
    });
  });
});
