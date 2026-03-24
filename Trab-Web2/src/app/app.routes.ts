import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login),
},
{
    path: 'Registrar',
    loadComponent: () =>
      import("./pages/tela-autocadastro/tela-autocadastro").then(m => m.TelaAutocadastro),
},


{
    path: 'HomeFuncionario',
    loadComponent: () =>
      import("./pages/pag-funcionario/pag-funcionario").then(m => m.PagFuncionario),
},

  {
    path: '',
    loadComponent: () =>
      import('./pages/topbar-user/topbar-user').then(m => m.TopbarUser),
    children: [
      {
        path: 'Solicitacao',
        loadComponent: () =>
          import('./pages/solicitacao-manutencao/solicitacao-manutencao')
            .then(m => m.SolicitacaoManutencao),
      },
      {
        path: 'Home',
        loadComponent: () =>
        import("./pages/pag-cliente/pag-cliente").then(m => m.PagCliente),
    },
    ]
}, 



];
