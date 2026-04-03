import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topbar-executor',
  imports: [RouterOutlet],
  templateUrl: './topbar-executor.component.html',
  styleUrl: './topbar-executor.component.css',
})
export class TopbarExecutorComponent {
  username : string = "";

  constructor(private router: Router) {}


  getHome(){
    this.router.navigate(['/funcionario/home'])
  }

  getManterEquipamento(){
    this.router.navigate(['/funcionario/equipamento'])
  }

    getManterFuncionario(){
    this.router.navigate(['/funcionario/users'])
  }

    getFinanceiro(){
    this.router.navigate(['/funcionario/financeiro'])
  }


  getLogout(){
    this.router.navigate([''])
  }

}
