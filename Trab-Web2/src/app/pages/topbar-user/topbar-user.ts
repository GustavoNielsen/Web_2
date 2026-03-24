import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar-user',
  imports: [RouterOutlet],
  templateUrl: './topbar-user.html',
  styleUrl: './topbar-user.css',
})
export class TopbarUser {

  username : string = "";

  constructor(private router: Router) {}


  getHome(){
    this.router.navigate(['/Home'])
  }

  getManutencao(){
    this.router.navigate(['/Solicitacao'])
  }


  getLogout(){
    this.router.navigate([''])
  }

}
