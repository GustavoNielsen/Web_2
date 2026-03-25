import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-executor',
  imports: [RouterOutlet],
  templateUrl: './navbar-executor.html',
  styleUrl: './navbar-executor.css',
})
export class NavbarExecutor {

  username : string = "";

  constructor(private router: Router) {}


  getHome(){
    this.router.navigate(['/home'])
  }

  getManutencao(){
    this.router.navigate(['/solicitacao'])
  }


  getLogout(){
    this.router.navigate([''])
  }
}
