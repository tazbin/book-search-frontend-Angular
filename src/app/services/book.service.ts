import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    private _http: HttpClient
  ) { }

  searchBooks(searchParams: string, page: number): Observable<any> {
    return this._http.get(`${environment.apiUrl}/book/search/${searchParams}/${page}`);
  }

  getBookDetails(bookId: string) :Observable<any> {
    return this._http.get(`${environment.apiUrl}/book/getBookDetails/${bookId}`);
  }

  addToFavourite(bookId: string): Observable<any> {
    return this._http.post(`${environment.apiUrl}/book/addToFavourite`, {bookId});
  }
  
  getFavouriteBooks(): Observable<any> {
    return this._http.get(`${environment.apiUrl}/book/getFavouriteBooks`);
  }
  
  removeFromList(bookId: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        bookId
      }
    };
    return this._http.delete(`${environment.apiUrl}/book/removeFromFavourite`, options);
  }
}
