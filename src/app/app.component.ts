import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'client';

  userSub: Subscription;

  constructor(
    private _authService: AuthService
  ) {}

  ngOnInit(): void {

    this.userSub = this._authService.getLoggedInUserData()
    .subscribe(res => {}, err => console.log(err));

  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }
}
