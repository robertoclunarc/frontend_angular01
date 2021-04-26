import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { Configuration } from '../app.configuration';
import { Balance, BalanceP } from "../models";

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  private url : string;


  constructor(private http: HttpClient) { 
    this.url = Configuration.urlContaBalance;
  }

  getBalance(database:string, since:string, until:string) : Observable<BalanceP[]>{
    const url = `${this.url}`;
    const params = { 'database': database, 'since': since, 'until':until };
    return this.http.get<BalanceP[]>(url,{params:params})
      .pipe(
        tap(result => this.log(`fetched Balance data result`)),
        catchError(this.handleError('getBalance', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log('BalanceService: ' + message);
  }

}
