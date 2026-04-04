import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login),
},
{
    path: 'registrar',
    loadComponent: () =>
      import("./pages/tela-autocadastro/tela-autocadastro").then(m => m.TelaAutocadastro),
},


{
    path: 'homefuncionario',
    loadComponent: () =>
      import("./pages/funcionario/pag-funcionario/pag-funcionario").then(m => m.PagFuncionario),
},

  {
    path: 'cliente',
    loadComponent: () =>
      import('./pages/topbar-user/topbar-user').then(m => m.TopbarUser),
    children: [
      {
        path: 'home',
        loadComponent: () =>
        import("./pages/cliente/pag-cliente/pag-cliente").then(m => m.PagCliente),
      },
      {
        path: 'solicitacao',
        loadComponent: () =>
          import('./pages/cliente/solicitacao-manutencao/solicitacao-manutencao')
            .then(m => m.SolicitacaoManutencao),
      },
 

    
    ]
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

      {path: 'equipamento/novo',
        loadComponent: () =>
        import('./pages/funcionario/crud-categoria/inserir-categoria/inserir-categoria.component')
          .then(m => m.InserirCategoriaComponent)
       },

        {path: 'equipamento/editar/:id',
        loadComponent: () =>
        import('./pages/funcionario/crud-categoria/editar-categoria/editar-categoria.component')
          .then(m => m.EditarCategoriaComponent)
       },

      {
        path: 'users',
        loadComponent: () =>
        import("./pages/funcionario/crud-funcionario/listar-funcionario/listar-funcionario.component").then(m => m.ListarFuncionarioComponent),
      },

      {path: 'users/novo',
        loadComponent: () =>
        import('./pages/funcionario/crud-funcionario/inserir-funcionario/inserir-funcionario.component')
          .then(m => m.InserirFuncionarioComponent)
          
       },
        {path: 'users/editar/:id',
        loadComponent: () =>
        import('./pages/funcionario/crud-funcionario/editar-funcionario/editar-funcionario.component')
          .then(m => m.EditarFuncionarioComponent)
       },

      {
        path: 'financeiro',
        loadComponent: () =>
        import("./pages/funcionario/pag-funcionario/pag-funcionario").then(m => m.PagFuncionario),
      },
    
    ]
},


];
