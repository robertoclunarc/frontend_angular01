import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Parametros } from '../models';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  private url: string;
  private parametros:Parametros

  constructor(private http: HttpClient) { 
    this.url = environment.apiUrl + 'parametros';
  }

  getParametros(): Observable<Parametros[]> {
    
    let apiUrl = `${this.url}`; 
    return this.http.get<Parametros[]>(apiUrl);
  }

  getParametros2() {
    const url = `${this.url}`;

    return this.http.get<Parametros[]>(url).toPromise()
      .then(data => {return data;})
      .catch();
  }

  actualizarParametros(parametros: Parametros) {
    
    const url = `${this.url}`;

    return this.http.patch<Parametros>(url, parametros)
      .pipe(
        catchError(this.handleError('actualizarParametros', parametros))
      );
  }

  
  getParamDir() {
  
  
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log('UserService: ' + message);
  }
  


}
