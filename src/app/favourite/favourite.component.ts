import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AddRemoveBook } from '../interfaces/add-remove-book';
import { FavBooks } from '../interfaces/fav-books';
import { User } from '../interfaces/user';
import { BookService } from '../services/book.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit {

  user$: Observable<User>;
  
  favBooks = <FavBooks>{};
  removeBook = <AddRemoveBook>{};

  constructor(
    private _bookService: BookService,
    private _utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.fetchFavMovies();
  }
  
  fetchFavMovies() {
    this.favBooks.loading = true;
    this.favBooks.err = '';

    this.favBooks.sub = this._bookService.getFavouriteBooks()
    .subscribe(movies => {
      
      this.favBooks.loading = false;
      this.favBooks.err = '';
      this.favBooks.list = movies;

      this.favBooks.sub.unsubscribe();

    }, err => {

      this.favBooks.loading = false;
      this.favBooks.err = err.error.error.message;
      this.favBooks.list = null;

      this.favBooks.sub.unsubscribe();

    });
  }


  removeFromList(bookId: string) {
    this._utils.setDocInnerText(bookId, 'Removing...');
    this._utils.setBtnDisabled(bookId, true);
    
    this.removeBook.loading = true;
    this.removeBook.err = '';
    
    this.removeBook.sub = this._bookService.removeFromList(bookId)
    .subscribe(res => {

      this.favBooks.list = this.favBooks.list.filter( b => b.id != bookId );
      this.removeBook.sub.unsubscribe();
      this._utils.setDocInnerText(bookId, 'Removed from list');
      this._utils.setBtnDisabled(bookId, true);
      
    },
    err => {

      this.removeBook.loading = false;
      this.removeBook.err = err.error.error.message;
      this.removeBook.sub.unsubscribe();
      this._utils.setDocInnerText(bookId, 'Remove from list');
      this._utils.setBtnDisabled(bookId, true);
      console.log('we got server error');
      console.log(err);

    })
  }

}
