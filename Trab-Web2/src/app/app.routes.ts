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
      import("./pages/pag-funcionario/pag-funcionario").then(m => m.PagFuncionario),
},

  {
    path: '',
    loadComponent: () =>
      import('./pages/topbar-user/topbar-user').then(m => m.TopbarUser),
    children: [
      {
        path: 'solicitacao',
        loadComponent: () =>
          import('./pages/solicitacao-manutencao/solicitacao-manutencao')
            .then(m => m.SolicitacaoManutencao),
      },
      {
        path: 'home',
        loadComponent: () =>
        import("./pages/pag-cliente/pag-cliente").then(m => m.PagCliente),
    },
    ]
}, 



];
