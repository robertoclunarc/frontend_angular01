import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MaterialProducto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MaterialesProductoService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'materiales';
  }

  consultarTodos(): Observable<MaterialProducto[]> {
    let apiURL = this.url; 
    return this.http.get<MaterialProducto[]>(apiURL);
  }


  consultarPorId(idAdmMaterialProducto: number): Observable<MaterialProducto[]> {

    const url = `${this.url}/${idAdmMaterialProducto}`;

    return this.http.get<MaterialProducto[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }


  registrar(materialProducto: MaterialProducto) {

    return this.http.post(this.url, materialProducto).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar MaterialProducto', []))
    );
  }

  actualizar(materialProductoActual: MaterialProducto) {

    const url = `${this.url}/${materialProductoActual.idAdmMaterialProducto}`;

    return this.http.put(url, materialProductoActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando MaterialProducto', []))
    );
  }

  eliminar(idAdmMaterialProducto: number) {

    const url = `${this.url}/${idAdmMaterialProducto}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando MaterialProducto', []))
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
