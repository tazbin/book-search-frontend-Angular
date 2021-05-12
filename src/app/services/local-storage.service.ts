import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

    // set accessToken & refreshToken
    setTokens(accessToken: string, refreshToken: string){
      try {
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
  
      } catch (error) {
        return null;
      }
    }
  
    // get the accessToken
    getAccessToken() {
      return localStorage.getItem('accessToken');
    }
  
    // get the refreshToken
    getRefreshToken() {
      return localStorage.getItem('refreshToken');
    }
  
    // remove both accessToken & refreshToken
    clearTokens() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    
}
