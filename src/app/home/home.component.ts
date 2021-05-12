import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AddRemoveBook } from '../interfaces/add-remove-book';
import { SearchResult } from '../interfaces/search-result';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { BookService } from '../services/book.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: Observable<User>;
  isViewLoading = true;
  form = {
    seachParams: ''
  };
  searchResult = <SearchResult> {};
  addToFavBook = <AddRemoveBook> {};

  constructor(
    private _authService: AuthService,
    private _bookService: BookService,
    private _utils: UtilsService
  ) { }


  ngOnInit(): void {
    this.isViewLoading = true;
    this.user = this._authService.user$;
  }

  // making an array of length totalPages for pagination
  counter() {
    return new Array(this.searchResult.totalPages);
  }

  // if this book added to the favourite
  ifAdded(list: [string], id: string): boolean {
    const found = list.find(element => element == id);
    if( found ) {
      return true;
    }
    return false;
  }

 
  searchBook( pageNumber?: number ) {
    this.searchResult.loading = true;
    this.searchResult.err = '';
    
    if( !this.form.seachParams.trim() ) {
      this.searchResult.err = "Searching text must not be empty!";
      this.form.seachParams = '';
    }

    pageNumber ? pageNumber = pageNumber : pageNumber = 1;

    this.searchResult.sub = this._bookService.searchBooks(this.form.seachParams, pageNumber)
    .subscribe(res => {

      this.searchResult.res = res;
      if( res.error == "0"  ) {
        this.searchResult.res.total = JSON.parse(res.total);
        this.searchResult.res.page = JSON.parse(res.page);
        this.searchResult.totalPages = Math.ceil(res.total / 10);
      } else {
        this.searchResult.err = res.error;
      }

      this.searchResult.loading = false;
      this.searchResult.sub.unsubscribe();
      
    }, err => {
      
      console.log(err);
      this.searchResult.err = err.error.error.message;
      this.searchResult.loading = false;
      this.searchResult.sub.unsubscribe();

    })

  }

  addBookToFavourite( bookId: string ) {
    this._utils.setDocInnerText(bookId, 'Adding...');
    this._utils.setBtnDisabled(bookId, true);

    this.addToFavBook.loading = true;
    this.addToFavBook.err = '';
    
    this.addToFavBook.sub = this._bookService.addToFavourite(bookId)
    .subscribe(res => {
      
      console.log('Book added to favourite!');
      this.addToFavBook.loading = false;
      this.addToFavBook.err = '';
      this._authService.user$.next(res);

      this._utils.setDocInnerText(bookId, 'In my favourite');
      this._utils.setBtnDisabled(bookId, false);

      this.addToFavBook.sub.unsubscribe();
      
    }, err => {
      
      this.addToFavBook.loading = false;
      this.addToFavBook.err = err.error.error.message;
      console.log(err.error);
      
      this._utils.setDocInnerText(bookId, 'Add to favourite');
      this._utils.setBtnDisabled(bookId, false);
      
      this.addToFavBook.sub.unsubscribe();

    });
  }

}
