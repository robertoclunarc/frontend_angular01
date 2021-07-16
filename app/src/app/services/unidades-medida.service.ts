import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UnidadMedida } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UnidadesMedidaService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.admCatalogoUrl + 'unidadmedidas';
  }

  consultarTodos(): Observable<UnidadMedida[]> {
    let apiURL = this.url + '/consultar';
    return this.http.get<UnidadMedida[]>(apiURL);
  }


  consultarPorId(idAdmUnidadMedida: number): Observable<UnidadMedida[]> {

    const url = `${this.url}/filtrar/${idAdmUnidadMedida}`;

    return this.http.get<UnidadMedida[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }


  registrar(unidadMedida: UnidadMedida) {

    return this.http.post(this.url + '/insertar', unidadMedida).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar UnidadMedida', []))
    );
  }

  actualizar(unidadMedidaActual: UnidadMedida) {

    const url = `${this.url}/actualizar/${unidadMedidaActual.idAdmUnidadMedida}`;

    return this.http.put(url, unidadMedidaActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando UnidadMedida', []))
    );
  }

  eliminar(idAdmUnidadMedida: number) {

    const url = `${this.url}/eliminar/${idAdmUnidadMedida}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando UnidadMedida', []))
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