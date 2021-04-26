import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { Configuration } from '../app.configuration';
import { Cestaticket, OtherTransaction } from "../models";

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  private url : string;

  constructor(private http: HttpClient) { 
    this.url = Configuration.urlNomina;
  }

  getCestaticket(database:string) : Observable<Cestaticket[]>{
    const url = `${this.url}/cestaticket`;
    let params = new HttpParams().set('database', database);
    return this.http.get<Cestaticket[]>(url,{params:params})
      .pipe(
        tap(result => this.log(`fetched Cestaticket data result`)),
        catchError(this.handleError('getCestaticket', []))
      );
  }

  getOtherTransaction(database:string) : Observable<OtherTransaction[]>{
    const url = `${this.url}/otrastrans`;
    let params = new HttpParams().set('database', database);
    return this.http.get<OtherTransaction[]>(url,{params:params})
      .pipe(
        tap(result => this.log(`fetched Other Transaction data result`)),
        catchError(this.handleError('getOtherTransaction', []))
      );
  }
  calcCestaticket(database:string, since:string,until:string) : Observable<any[]>{
    const url = `${this.url}/cestaticket`;
    const params = { 'database': database, 'since': since, 'until':until };
    return this.http.post<Cestaticket[]>(url,params)
      .pipe(
        tap(result => this.log(`calc Cestaticket`)),
        catchError(this.handleError('calcCestaticket', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log('RosterService: ' + message);
  }

}
