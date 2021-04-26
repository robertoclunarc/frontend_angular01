import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Md5 } from "ts-md5/dist/md5";
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs";

import {Configuration} from '../app.configuration';
import { Company, User } from "../models";

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  
  private url : string;

  constructor(private http: HttpClient) { 
    this.url = Configuration.urlCompanyAdm;
  }

  auth(login : string, password : string) : Observable<User> {
    const md5Pass = String(Md5.hashStr(password));
    const params = { 'login': login, 'password': md5Pass };
    let body = JSON.stringify(params);
    return this.http.post<User>(Configuration.urlLogin,params);
  }

  getCompanys(module:string): Observable<Company[]> {
    switch (module) {
      case "adm":
        this.url = Configuration.urlCompanyAdm;
        break;
      case "conta":
        this.url = Configuration.urlCompanyConta;
        break;
      case "nomi":
        this.url = Configuration.urlCompanyNomi;
        break;
      default:
        break;
    }
    return this.http.get<Company[]>(this.url)
    .pipe(
      tap(result => this.log(`fetched companys`)),
      catchError(this.handleError('getCompanys', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log('CompanyService: ' + message);
  }
}
