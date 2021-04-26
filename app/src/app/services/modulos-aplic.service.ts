import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ModuloAplicacion } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ModulosAplicService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'modulos';
  }


  consultarTodos(): Observable<ModuloAplicacion[]> {

    return this.http.get<ModuloAplicacion[]>(this.url)
      .pipe(
        tap(result => this.log(`consultarTodos ModuloAplicacion`)),
        catchError(this.handleError('consultarTodos', []))
      );
  }


  consultarPorId(idAdmModulo: number): Observable<ModuloAplicacion[]> {

    const url = `${this.url}/${idAdmModulo}`;

    return this.http.get<ModuloAplicacion[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }


  registrar(moduloAplicacion: ModuloAplicacion) {

    return this.http.post(this.url, moduloAplicacion).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar ModuloAplicacion', []))
    );
  }

  actualizar(moduloAplicacionActual: ModuloAplicacion) {

    const url = `${this.url}/${moduloAplicacionActual.idAdmModulo}`;

    return this.http.put(url, moduloAplicacionActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando ModuloAplicacion', []))
    );
  }

  eliminar(idAdmModulo: number) {

    const url = `${this.url}/${idAdmModulo}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando ModuloAplicacion', []))
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
