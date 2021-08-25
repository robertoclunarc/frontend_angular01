import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import {  Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { RolModelo } from '../models/rol';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';
import { TipoAcciones } from '../models/tipo-acciones';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  URL_api: string = environment.apiUrl + "rol";
  URL_api_todos: string = environment.apiUrl + "roles";
  URL_api_tipoaccion: string = environment.apiUrl + "tipoacciones";

  //private usersSubject = new BehaviorSubject([]);
  //private RolesE : RolModelo[] = [];

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getTodos(): Observable<RolModelo[]> {
    return this.http.get<RolModelo[]>(this.URL_api_todos)
      .pipe(
        tap(result => console.log(`Resultado Roles Exitoso`)),
        catchError(this.handleError('getTodosRol ', []))
      );
  }

  getTodosP(): Promise<RolModelo[]> {
    return this.http.get<RolModelo[]>(this.URL_api_todos).toPromise();
  }

  //TEMPORAL : ****** HAY QUE CREAR SU SERVICIO
  getTiposAcciones(): Promise<TipoAcciones[]> {
    return this.http.get<TipoAcciones[]>(this.URL_api_tipoaccion).toPromise();
  }

  getDetalleRol(idSegRol: number) {
    return this.http.get<RolModelo>(this.URL_api + "/" + idSegRol)
      .pipe(
        tap(result => console.log(`Resultado DetalleRol Exitoso`)),
        catchError(this.handleError('getDetallePefil ', []))
      );
  }

  nuevoRol(Rol: RolModelo) {
    return this.http.post(this.URL_api, Rol).pipe(
      tap(result => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("Rol ingresado", currentUser);
      }),
      catchError(this.handleError('setRol', []))
    );
  }


  actualizarRol(Rol: RolModelo) : Observable<RolModelo> {
    //this.URL_api_actualizar += "/" + Rol.idSegRol;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };

    console.log(this.URL_api + '/' + Rol.idSegRol);
    console.log(Rol);

    return this.http.put<RolModelo>(this.URL_api + "/" + Rol.idSegRol, Rol, httpOptions)
    .pipe(
      catchError(this.handleError('updateHero', Rol))
    );
  
  }

  eliminarRol(Rol: RolModelo) {

    return this.http.delete(this.URL_api + "/" + Rol.idSegRol).pipe(
      tap(result => {
        console.log('Rol Eliminado');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("Rol Eliminado", currentUser);
      }),
      catchError(this.handleError('setRol', []))
    );
  }

  //---------------Manejo de Errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
