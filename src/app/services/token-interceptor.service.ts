import {
  HttpErrorResponse,
  HttpEvent, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  private refreshingInProgress: boolean;
  private accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private _authService: AuthService,
    private _localStorageService: LocalStorageService,
    private _router: Router
  ) { }

  // function to intercept every ongoign request
  intercept(req: HttpRequest<any>, next: HttpHandler):
  Observable<HttpEvent<any>> {

    const accessToken = this._localStorageService.getAccessToken();

    return next.handle(
      this.addAuthorizationHeader(req, accessToken)
    ).pipe(
      catchError(err => {

        // in case of 401 http error
        if( err instanceof HttpErrorResponse && err.status == 401 ) {

          console.log('AccessToken expired!');
          const refreshToken = this._localStorageService.getAccessToken();
  
          if( accessToken && refreshToken ) {
            return this.refreshToken(req, next);
          }
  
          return this.logoutAndReditrect(err);
          
        }
        
        // in case of 403 response
        if( err instanceof HttpErrorResponse && err.status == 403 ) {
          console.log('RefreshToken expired!');
          return this.logoutAndReditrect(err);
        }

        // if error has neither 401 nor 403 status then just throw the error
        return throwError(err);

      })
    );

  }

  private logoutAndReditrect(err): Observable<HttpEvent<any>> {

    this._authService.logout();
    this._router.navigate(['/login']);
    return throwError(err);
    
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.refreshingInProgress) {

      this.refreshingInProgress = true;
      this.accessTokenSubject.next(null);

      return this._authService.refreshToken().pipe(
        switchMap((res) => {
          this.refreshingInProgress = false;
          this.accessTokenSubject.next(res.accessToken);
          // repeat failed request with new token
          return next.handle(this.addAuthorizationHeader(request, res.accessToken));
        })
      );

    } else {

      // wait while getting new token
      return this.accessTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          // repeat failed request with new token
          return next.handle(this.addAuthorizationHeader(request, token));
        }));

    }

  }

  // function to add accessToken to the header
  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest <any> {

    if( token ) { // accessToken exists

      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

    } else { // accessToken does not exists

      return request;

    }
  }

}
