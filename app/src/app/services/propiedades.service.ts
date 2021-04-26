import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Propiedad } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'propiedades';
  }
  
  consultarTodos(): Observable<Propiedad[]> {

    return this.http.get<Propiedad[]>(this.url)
      .pipe(
        tap(result => this.log(`consultarTodos Propiedad`)),
        catchError(this.handleError('consultarTodos', []))
      );
  }


  consultarPorId(idAdmPropiedad: number): Observable<Propiedad[]> {

    const url = `${this.url}/${idAdmPropiedad}`;

    return this.http.get<Propiedad[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }


  registrar(propiedad: Propiedad) {

    return this.http.post(this.url, propiedad).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar Propiedad', []))
    );
  }

  actualizar(propiedadActual: Propiedad) {

    const url = `${this.url}/${propiedadActual.idAdmPropiedad}`;

    return this.http.put(url, propiedadActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando Propiedad', []))
    );
  }

  eliminar(idAdmPropiedad: number) {

    const url = `${this.url}/${idAdmPropiedad}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando Propiedad', []))
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
