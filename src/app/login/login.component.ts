import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form = {
    email: '',
    password: ''
  };
  loading: boolean = false;
  loginSub: Subscription;
  errorMsg = '';

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.errorMsg = '';
    this.loading = true;
    
    this.loginSub = this._authService.login(this.form)
    .subscribe(res => {

      this._router.navigate(['/favourite']);
      this.loginSub.unsubscribe();
      this.loading = false;

    }, err => {

      this.errorMsg = err.error.error.message;
      this.loginSub.unsubscribe();
      console.log(err)
      this.loading = false;

    });
  }

}
