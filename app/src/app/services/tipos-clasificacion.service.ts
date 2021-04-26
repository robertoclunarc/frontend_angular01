import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TipoClasificacion } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TiposClasificacionService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'tipos';
  }
  
  consultarTodos(): Observable<TipoClasificacion[]> {
    let apiUrl = this.url;
    return this.http.get<TipoClasificacion[]>(apiUrl);
  }

  consultarPorId(idAdmTipoClasificacion: number): Observable<TipoClasificacion[]> {

    const url = `${this.url}/${idAdmTipoClasificacion}`;

    return this.http.get<TipoClasificacion[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }

  consultarSubTiposPoridAdmTipoClasificacion(idAdmTipoClasificacion: number): Observable<TipoClasificacion[]> {
    let apiUrl = `${this.url}/${idAdmTipoClasificacion}/subtipos`;
    return this.http.get<TipoClasificacion[]>(apiUrl);
  }


  registrar(tipoClasificacion: TipoClasificacion) {

    return this.http.post(this.url, tipoClasificacion).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar TipoClasificacion', []))
    );
  }

  actualizar(tipoClasificacionActual: TipoClasificacion) {

    const url = `${this.url}/${tipoClasificacionActual.idAdmTipoClasificacion}`;

    return this.http.put(url, tipoClasificacionActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando TipoClasificacion', []))
    );
  }

  eliminar(idAdmTipoClasificacion: number) {

    const url = `${this.url}/${idAdmTipoClasificacion}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando TipoClasificacion', []))
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
