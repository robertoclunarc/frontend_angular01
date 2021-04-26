import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SubGrupoProducto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SubGruposProductoService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'subgrupos';
  }

  consultarTodos(): Observable<SubGrupoProducto[]> {
    let apiUrl = this.url; 
    return this.http.get<SubGrupoProducto[]>(apiUrl);
  }


  consultarPorId(idAdmSubGrupoProducto: number): Observable<SubGrupoProducto[]> {

    const url = `${this.url}/${idAdmSubGrupoProducto}`;

    return this.http.get<SubGrupoProducto[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }


  registrar(subGrupoProducto: SubGrupoProducto) {

    return this.http.post(this.url, subGrupoProducto).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar SubGrupoProducto', []))
    );
  }

  actualizar(subGrupoProductoActual: SubGrupoProducto) {

    const url = `${this.url}/${subGrupoProductoActual.idAdmSubGrupoProducto}`;

    return this.http.put(url, subGrupoProductoActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando SubGrupoProducto', []))
    );
  }

  eliminar(idAdmSubGrupoProducto: number) {

    const url = `${this.url}/${idAdmSubGrupoProducto}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando SubGrupoProducto', []))
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
