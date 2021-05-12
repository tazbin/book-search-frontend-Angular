import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new BehaviorSubject(null);

  constructor( 

    private _http: HttpClient,
    private _localStorageService: LocalStorageService

    ) { }

  
  // register a new user
  register( form: { name: string; email: string; password: string } ): Observable<any> {
    return this._http.post(`${environment.apiUrl}/user/register`, form)
    .pipe(
      tap(data => {

        this.user$.next(data.user);

        this._localStorageService.setTokens(data.accessToken, data.refreshToken)

      })
    )
  }

  // login user
  login( form: { email: string; password: string } ) : Observable<any> {
    return this._http.post(`${environment.apiUrl}/user/login`, form)
    .pipe(
      tap(data => {

        this.user$.next(data.user);

        this._localStorageService.setTokens(data.accessToken, data.refreshToken)

      })
    );
  }

  // logout user
  logout() {
    this._localStorageService.clearTokens();
    this.user$.next(null);
  }

  // get logged in user's data
  getLoggedInUserData(): Observable<User> {
    
    return this.user$.pipe(
      switchMap(user => {
        
        if( user ) { // behaviour subject already has the user data inside it
          return of(user);
        }
        
        const accessToken = this._localStorageService.getAccessToken();

        // behaviour subject does not have user data inside it
        
        if( accessToken ) { // accessToken exists in localStorage
          return this.fetchLoggedInUserData();
        }

        // there is no accessToken or userData in behaviour subject
        return of(null);

      })
    )
  }

  // fetch loggedIn user's data with accessToken
  fetchLoggedInUserData(): Observable <User> {
    return this._http.get<any>(`${environment.apiUrl}/user/me/getLoggedInUserData`)
    .pipe(
      tap(user => {
        this.user$.next(user);
      })
    );
  }

  // get new pair of access & refresh token from old refresh token
  refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {

    const refreshToken = this._localStorageService.getRefreshToken();
    return this._http.post<{ accessToken: string; refreshToken: string }>(`${environment.apiUrl}/user/me/tokenRefresh`, {refreshToken})
    .pipe(
      tap(tokens => {
        console.log('Token refreshed!');
        this._localStorageService.setTokens(tokens.accessToken, tokens.refreshToken);
      })
    );

  }

}
