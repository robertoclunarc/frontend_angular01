import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SubTipoClasificacion, Propiedad } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SubtiposClasificacionService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'subtipos';
  }

  consultarTodos(): Observable<SubTipoClasificacion[]> {

    return this.http.get<SubTipoClasificacion[]>(this.url)
      .pipe(
        tap(result => this.log(`consultarTodos SubTipoClasificacion`)),
        catchError(this.handleError('consultarTodos', []))
      );
  }


  consultarPorId(idAdmSubTipoClasificacion: number): Observable<SubTipoClasificacion[]> {

    const url = `${this.url}/${idAdmSubTipoClasificacion}`;

    return this.http.get<SubTipoClasificacion[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }

  consultarPropiedadesPorIdSubTipoClasificacion(idAdmSubTipoClasificacion: number): Observable<Propiedad[]> {

    let apiUrl = `${this.url}/${idAdmSubTipoClasificacion}/propiedades`; 

    return this.http.get<Propiedad[]>(apiUrl);
  }

  consultarPropiedadesAsignadas(idAdmSubTipoClasificacion: number): Observable<Propiedad[]> {

    let apiUrl = `${this.url}/${idAdmSubTipoClasificacion}/propiedadesAsignadas`; 

    return this.http.get<Propiedad[]>(apiUrl);
  }

  consultarPropiedadesNoAsignadas(idAdmSubTipoClasificacion: number): Observable<Propiedad[]> {

    let apiUrl = `${this.url}/${idAdmSubTipoClasificacion}/propiedadesNoAsignadas`; 

    return this.http.get<Propiedad[]>(apiUrl);
  }

  registrar(subTipoClasificacion: SubTipoClasificacion) {

    return this.http.post(this.url, subTipoClasificacion).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar SubTipoClasificacion', []))
    );
  }

  actualizar(subTipoClasificacionActual: SubTipoClasificacion) {

    const url = `${this.url}/${subTipoClasificacionActual.idAdmSubTipoClasificacion}`;

    return this.http.put(url, subTipoClasificacionActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando SubTipoClasificacion', []))
    );
  }

  eliminar(idAdmSubTipoClasificacion: number) {

    const url = `${this.url}/${idAdmSubTipoClasificacion}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando SubTipoClasificacion', []))
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
