import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TipoMedida, UnidadMedida } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TiposMedidasService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'tiposmedida';
  }

  consultarTodos(): Observable<TipoMedida[]> {

    let apiURL = this.url;
    return this.http.get<TipoMedida[]>(apiURL);
  }


  consultarPorId(idAdmTipoMedida: number): Observable<TipoMedida[]> {

    const url = `${this.url}/${idAdmTipoMedida}`;

    return this.http.get<TipoMedida[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }

  consultarUnidadesMedidasPoridAdmTipoMedida(idAdmTipoMedida: number): Observable<UnidadMedida[]> {

    let apiURL = `${this.url}/${idAdmTipoMedida}/unidadmedidas`;
    return this.http.get<UnidadMedida[]>(apiURL);
  }


  registrar(tipoMedida: TipoMedida) {

    return this.http.post(this.url, tipoMedida).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar TipoMedida', []))
    );
  }

  actualizar(tipoMedidaActual: TipoMedida) {

    const url = `${this.url}/${tipoMedidaActual.idAdmTipoMedida}`;

    return this.http.put(url, tipoMedidaActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando TipoMedida', []))
    );
  }

  eliminar(idAdmTipoMedida: number) {

    const url = `${this.url}/${idAdmTipoMedida}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando TipoMedida', []))
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
