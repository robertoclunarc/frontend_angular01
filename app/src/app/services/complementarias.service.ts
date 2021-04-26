import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ComplementariaProducto } from '../models';
import { LogTransacService } from './logtransac.service';

@Injectable({
  providedIn: 'root'
})
export class ComplementariasService {

  private url: string;

  constructor(private http: HttpClient, private srvlog: LogTransacService ) { 

    this.url = environment.apiUrl + 'complementarias';
  
  }


  consultarTodos(): Observable<ComplementariaProducto[]> {

    return this.http.get<ComplementariaProducto[]>(this.url)
      .pipe(
        tap(result => this.log(`fetched ComplementariaProducto`)),
        catchError(this.handleError('consultarTodos', []))
      );
  }


  consultarPorId(idAdmComplementariaProducto: number): Observable<ComplementariaProducto[]> {

    const url = `${this.url}/${idAdmComplementariaProducto}`;

    return this.http.get<ComplementariaProducto[]>(url)
      .pipe(
        tap(result => this.log(`fetched ComplementariaProducto`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }


  registrar(complementariaProducto: ComplementariaProducto) {

    /*return this.http.post(this.url, complementariaProducto).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar', []))
    );*/
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("DATOS COMPLEMENTARIOS PRODUCTO " + complementariaProducto.idAdmProducto, currentUser, 1);
    return this.http.post(this.url, complementariaProducto).toPromise();
  }

  actualizar(complementariaProductoActual: ComplementariaProducto) {

    const url = `${this.url}/${complementariaProductoActual.idAdmComplementariaProducto}`;

   /* return this.http.put(url, complementariaProductoActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando ComplementariaProducto', []))
    );*/
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("ACTUALIZACION DE DATOS COMPLEMENTARIOS " + complementariaProductoActual.idAdmProducto, currentUser, 1);
    return this.http.put(url, complementariaProductoActual).toPromise();
  }

  eliminar(idAdmComplementariaProducto: number){

    const url = `${this.url}/${idAdmComplementariaProducto}`;
    
    /*return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando ComplementariaProducto', []))
    );*/
    return this.http.delete(url).toPromise();


  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log('UserService: ' + message);
  }

}
