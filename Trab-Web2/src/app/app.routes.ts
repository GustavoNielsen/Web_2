import { Routes } from '@angular/router';
import { TopbarUser } from './pages/topbar-user/topbar-user';
import { PagCliente } from './pages/cliente/pag-cliente/pag-cliente';
import { SolicitacaoManutencao } from './pages/cliente/solicitacao-manutencao/solicitacao-manutencao';
import { Login } from './pages/login/login';
import { TelaAutocadastro } from './pages/tela-autocadastro/tela-autocadastro';

export const routes: Routes = 
[{
  path: '',
  pathMatch: 'full',
  component: Login,
},

{
  path: 'registrar',
  component: TelaAutocadastro,
},

{
  path: 'cliente',
  component: TopbarUser,
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'home',
    },
    {
      path: 'home',
      component: PagCliente,
    },
    {
      path: 'servico/:id',
      component: PagCliente,
      data: { modal: 'visualizar' },
    },
    {
      path: 'orcamento/:id',
      component: PagCliente,
      data: { modal: 'orcamento' },
    },
    {
      path: 'rejeitar/:id',
      component: PagCliente,
      data: { modal: 'rejeitar' },
    },
    {
      path: 'resgatar/:id',
      component: PagCliente,
      data: { modal: 'resgatar' },
    },
    {
      path: 'pagamento/:id',
      component: PagCliente,
      data: { modal: 'pagamento' },
    },
    {
      path: 'solicitacao',
      component: SolicitacaoManutencao,
    },



  ]
},

{
  path: 'homefuncionario',
  loadComponent: () =>
    import("./pages/funcionario/pag-funcionario/pag-funcionario").then(m => m.PagFuncionario),
},

{
  path: 'funcionario',
  loadComponent: () =>
    import('./pages/topbar-executor/topbar-executor.component').then(m => m.TopbarExecutorComponent),
  children: [
    {
      path: 'home',
      loadComponent: () =>
        import("./pages/funcionario/pag-funcionario/pag-funcionario").then(m => m.PagFuncionario),
    },

    {
      path: 'equipamento',
      loadComponent: () =>
        import('./pages/funcionario/crud-categoria/listar-categoria/listar-categoria.component').then(m => m.ListarCategoriaComponent),
    },

    {
      path: 'equipamento/novo',
      loadComponent: () =>
        import('./pages/funcionario/crud-categoria/inserir-categoria/inserir-categoria.component')
          .then(m => m.InserirCategoriaComponent)
    },

    {
      path: 'equipamento/editar/:id',
      loadComponent: () =>
        import('./pages/funcionario/crud-categoria/editar-categoria/editar-categoria.component')
          .then(m => m.EditarCategoriaComponent)
    },

    {
      path: 'users',
      loadComponent: () =>
        import("./pages/funcionario/crud-funcionario/listar-funcionario/listar-funcionario.component").then(m => m.ListarFuncionarioComponent),
    },

    {
      path: 'users/novo',
      loadComponent: () =>
        import('./pages/funcionario/crud-funcionario/inserir-funcionario/inserir-funcionario.component')
          .then(m => m.InserirFuncionarioComponent)

    },
    {
      path: 'users/editar/:id',
      loadComponent: () =>
        import('./pages/funcionario/crud-funcionario/editar-funcionario/editar-funcionario.component')
          .then(m => m.EditarFuncionarioComponent)
    },
    {
      path: 'orcamento-financeiro',
      loadComponent: () =>
        import('./pages/funcionario/painel-orcamento/painel-orcamento.component').then(m => m.PainelOrcamentoComponent)
    },

  ]
},


];
