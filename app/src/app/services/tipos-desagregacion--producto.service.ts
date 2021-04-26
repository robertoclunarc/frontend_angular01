import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TipoDesagregacionProducto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TiposDesagregacionProductoService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'tiposdesagregacion';
  }

  consultarTodos(): Observable<TipoDesagregacionProducto[]> {
    let apiURL = this.url;
    return this.http.get<TipoDesagregacionProducto[]>(apiURL);
  }


  consultarPorId(idAdmTipoDesagregacionProducto: number): Observable<TipoDesagregacionProducto[]> {

    const url = `${this.url}/${idAdmTipoDesagregacionProducto}`;

    return this.http.get<TipoDesagregacionProducto[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }


  registrar(tipoDesagregacionProducto: TipoDesagregacionProducto) {

    return this.http.post(this.url, tipoDesagregacionProducto).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar TipoDesagregacionProducto', []))
    );
  }

  actualizar(tipoDesagregacionProductoActual: TipoDesagregacionProducto) {

    const url = `${this.url}/${tipoDesagregacionProductoActual.idAdmTipoDesagregacionProducto}`;

    return this.http.put(url, tipoDesagregacionProductoActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando TipoDesagregacionProducto', []))
    );
  }

  eliminar(idAdmTipoDesagregacionProducto: number) {

    const url = `${this.url}/${idAdmTipoDesagregacionProducto}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando TipoDesagregacionProducto', []))
    );
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
