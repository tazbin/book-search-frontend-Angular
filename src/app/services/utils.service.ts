import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  setDocInnerText( id: string, text: string ) {
    var doc = document.getElementById(id);
    doc.innerText = text;
  }

  setBtnDisabled(id: string, state: boolean) {
    var btn = <HTMLInputElement> document.getElementById(id);
    btn.disabled = state;
  }
  
}
