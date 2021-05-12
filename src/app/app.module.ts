import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookComponent } from './book/book.component';
import { CommonComponent } from './common/common.component';
import { FooterComponent } from './common/footer/footer.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AboutComponent } from './about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    FavouriteComponent,
    BookComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{ 
    provide: HTTP_INTERCEPTORS, 
    useClass: TokenInterceptorService, 
    multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
