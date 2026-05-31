import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar-user',
  imports: [RouterOutlet],
  templateUrl: './topbar-user.html',
  styleUrl: './topbar-user.css',
})
export class TopbarUser {

  username : string = "";

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.username = this.authService.getUsername();
  }


  getHome(){
    this.router.navigate(['/cliente/home'])
  }

  getManutencao(){
    this.router.navigate(['/cliente/solicitacao'])
  }


  getLogout(){
    this.authService.logout();
    this.router.navigate([''])
  }

}
