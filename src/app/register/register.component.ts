import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form = {
    name: '',
    email: '',
    password: ''
  };
  loading: boolean = false;
  registerSub: Subscription;
  errorMsg = '';

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true;
    this.errorMsg = '';

    this.registerSub = this._authService.register(this.form)
    .subscribe(res => {
      console.log('Registered!');
      this.loading = false;
      this.registerSub.unsubscribe();
      this._router.navigate(['/favourite']);
    }, err => {
      console.log(err);
      this.errorMsg = err.error.error.message;
      this.loading = false;
      this.registerSub.unsubscribe();
    })
  }

}
