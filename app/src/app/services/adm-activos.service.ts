import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Activo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdmActivosService {
  private url: string;

  constructor(private http: HttpClient) { 
    this.url = environment.apiUrl + 'activos';
  }


  consultarTodos(): Observable<Activo[]> {

    return this.http.get<Activo[]>(this.url)
      .pipe(
        tap(result => this.log(`fetched Activos`)),
        catchError(this.handleError('consultarTodos', []))
      );
  }


  consultarPorId(idAdmActivo: number): Observable<Activo[]> {

    const url = `${this.url}/${idAdmActivo}`;

    return this.http.get<Activo[]>(url)
      .pipe(
        tap(result => this.log(`fetched Activo`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }

  getPorGerencias(idGerencia: number): Promise<Activo[]> {

    const url = `${this.url}/gerencia/${idGerencia}`;
    console.log(url);
    

    return this.http.get<Activo[]>(url).toPromise();
  }


  registrar(activo: Activo) {

    return this.http.post(this.url, activo).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar activo', []))
    );
  }

  actualizar(activoActual: Activo) {

    const url = `${this.url}/${activoActual.idAdmActivo}`;

    return this.http.put(url, activoActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando Activo', []))
    );
  }

  eliminar(idAdmActivo: number){

    const url = `${this.url}/${idAdmActivo}`;
    
    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando Activo', []))
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
