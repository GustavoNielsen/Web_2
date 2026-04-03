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
    path: '',
    loadComponent: () =>
      import('./pages/topbar-user/topbar-user').then(m => m.TopbarUser),
    children: [
      {
        path: 'solicitacao',
        loadComponent: () =>
          import('./pages/cliente/solicitacao-manutencao/solicitacao-manutencao')
            .then(m => m.SolicitacaoManutencao),
      },
      {
        path: 'home',
        loadComponent: () =>
        import("./pages/cliente/pag-cliente/pag-cliente").then(m => m.PagCliente),
      },

      { path: 'funcionarios/listar',
        loadComponent: () =>
        import('./pages/funcionario/crud-funcionario/listar-funcionario/listar-funcionario.component')
          .then(m => m.ListarFuncionarioComponent)
       }, 

       {path: 'funcionarios/novo',
        loadComponent: () =>
        import('./pages/funcionario/crud-funcionario/inserir-funcionario/inserir-funcionario.component')
          .then(m => m.InserirFuncionarioComponent)
       },

       {path: 'categorias/listar',
        loadComponent: () =>
        import('./pages/funcionario/crud-categoria/listar-categoria/listar-categoria.component')
          .then(m => m.ListarCategoriaComponent)
       },

       {path: 'categorias/novo',
        loadComponent: () =>
        import('./pages/funcionario/crud-categoria/inserir-categoria/inserir-categoria.component')
          .then(m => m.InserirCategoriaComponent)
       }
  

    
    ]
}, 



];
