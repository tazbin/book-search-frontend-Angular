import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: Observable<User>;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {

    this.user = this._authService.user$;

  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }

}
