import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AddRemoveBook } from '../interfaces/add-remove-book';
import { Book } from '../interfaces/book';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  user: Observable<User>;
  bookId: string;
 
  book = <Book> {};
  addRemoveBook = <AddRemoveBook> {};

  constructor(
    private _authService: AuthService,
    private _bookService: BookService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.user = this._authService.user$;
    this.bookId = this._route.snapshot.params.bookId;

    this.fetchBookDetails(this.bookId);

  }

  fetchBookDetails(bookId: string) {
    this.book.loading = true;

    this.book.sub = this._bookService.getBookDetails(bookId)
    .subscribe(res => {

      this.book.info = res;
      this.book.err = '';
      this.book.loading = false;

      this.book.sub.unsubscribe();
      
    }, err => {
      console.log(err);
      this.book.err = err.error.error.message;
      this.book.loading = false;
      this.book.sub.unsubscribe();
    });
  }

  ifAdded(list: [string], id: string): boolean {
    const found = list.find(element => element == id);
    if( found ) {
      return true;
    }
    return false;
  }

  addMovieToFavourite() {
    this.addRemoveBook.loading = true;
    this.addRemoveBook.err = '';

    this.addRemoveBook.sub = this._bookService.addToFavourite(this.bookId)
    .subscribe(res => {
      console.log('Book added to favourite!');
      this._authService.user$.next(res);

      this.addRemoveBook.sub.unsubscribe();
      this.addRemoveBook.loading = false;
    }, err => {
      console.log(err);
      this.addRemoveBook.err = err.error.error.message;
      this.addRemoveBook.sub.unsubscribe();
      this.addRemoveBook.loading = false;
    });
    
  }

  removeFromList() {
    this.addRemoveBook.loading = true;
    this.addRemoveBook.err = '';

    this.addRemoveBook.sub = this._bookService.removeFromList(this.bookId)
    .subscribe(res => {
      console.log('Removed from list!');
      this._authService.user$.next(res);

      this.addRemoveBook.sub.unsubscribe();
      this.addRemoveBook.loading = false;
    },
    err => {
      console.log(err);
      this.addRemoveBook.err = err.error.error.message;
      this.addRemoveBook.sub.unsubscribe();
      this.addRemoveBook.loading = false;
    })
  }

}
