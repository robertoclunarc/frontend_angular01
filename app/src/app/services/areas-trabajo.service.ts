import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AreaTrabajo } from '../models/area-trabajo';
import { AreaNegocioModelo } from '../models/area-negocio';

//adm_areas_trabajo.php

@Injectable({
  providedIn: 'root'
})
export class AreasTrabajoService {

  private url: string;

  constructor(private http: HttpClient) { 
    this.url = environment.apiUrl + 'areastrabajo';
    //this.url = environment.apiUrl + 'areas_trabajo';
  }


  consultarTodos(): Observable<AreaTrabajo[]> {

    return this.http.get<AreaTrabajo[]>(this.url)
      .pipe(
        tap(result => this.log(`fetched AreaTrabajo`)),
        catchError(this.handleError('consultarTodos', []))
      );
  }


  consultarPorId(idAdmAreaTrabajoGerencia: number): Observable<AreaTrabajo[]> {

    const url = `${this.url}/${idAdmAreaTrabajoGerencia}`;

    return this.http.get<AreaTrabajo[]>(url)
      .pipe(
        tap(result => this.log(`fetched AreaTrabajo`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }

  areasPorGerenciasProducto(idConfigGerencia: number, codigoProducto : number) : Promise<AreaTrabajo[]>{
    return this.http.get<AreaTrabajo[]>(`${environment.apiUrl}areasporproducto/${idConfigGerencia}/${codigoProducto}`).toPromise();
  }




  registrar(areaTrabajo: AreaTrabajo) {

    return this.http.post(this.url, areaTrabajo).pipe(
      tap(result => {
      }),
      catchError(this.handleError('setUsuario', []))
    );
  }

  actualizar(areaTrabajoActual: AreaTrabajo) {

    const url = `${this.url}/${areaTrabajoActual.idAdmAreaTrabajoGerencia}`;

    return this.http.put(url, areaTrabajoActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando AreaTrabajo', []))
    );
  }

  eliminar(idAdmAreaTrabajoGerencia: number){

    const url = `${this.url}/${idAdmAreaTrabajoGerencia}`;
    
    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando Area de Trabajo', []))
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
