import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ColorProducto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ColoresProductoService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'colores';
  }

  consultarTodos(): Observable<ColorProducto[]> {
    let apiURL = this.url; 
    return this.http.get<ColorProducto[]>(apiURL);
  }


  consultarPorId(idAdmColorProducto: number): Observable<ColorProducto[]> {

    const url = `${this.url}/${idAdmColorProducto}`;

    return this.http.get<ColorProducto[]>(url)
      .pipe(
        tap(result => this.log(`consultarPorId`)),
        catchError(this.handleError('consultarPorId', []))
      );
  }


  registrar(colorProducto: ColorProducto) {

    return this.http.post(this.url, colorProducto).pipe(
      tap(result => {
      }),
      catchError(this.handleError('registrar ColorProducto', []))
    );
  }

  actualizar(colorProductoActual: ColorProducto) {

    const url = `${this.url}/${colorProductoActual.idAdmColorProducto}`;

    return this.http.put(url, colorProductoActual).pipe(
      tap(result => {
      }),
      catchError(this.handleError('actualizando ColorProducto', []))
    );
  }

  eliminar(idAdmColorProducto: number) {

    const url = `${this.url}/${idAdmColorProducto}`;

    return this.http.delete(url).pipe(
      tap(result => {
      }),
      catchError(this.handleError('error eliminando ColorProducto', []))
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
