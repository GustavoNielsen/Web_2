import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar-executor',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './topbar-executor.component.html',
  styleUrl: './topbar-executor.component.css',
})
export class TopbarExecutorComponent {
  username : string = "";

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.username = this.authService.getUsername();
  }


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
    this.authService.logout();
    this.router.navigate([''])
  }

}
