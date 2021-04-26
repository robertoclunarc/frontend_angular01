import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GrupoProducto, SubGrupoProducto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GruposProductoService {

  private url: string;

  private results: GrupoProducto[];

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'grupos';
  }

  consultarTodos(): Observable<GrupoProducto[]> {

    let apiURL = this.url;
    return this.http.get<GrupoProducto[]>(apiURL);


/*     return this.http.get<GrupoProducto[]>(apiURL)
      .pipe(
        tap(result => this.log(`consultarTodos GrupoProducto`)),
        catchError(this.handleError('consultarTodos', []))
      ); */
  }


consultarPorId(idAdmGrupoProducto: number): Observable < GrupoProducto[] > {

  const url = `${this.url}/${idAdmGrupoProducto}`;

  return this.http.get<GrupoProducto[]>(url)
    .pipe(
      tap(result => this.log(`consultarPorId`)),
      catchError(this.handleError('consultarPorId', []))
    );
}

consultarSubGruposPorIdAdmGrupo(idAdmGrupoProducto: number): Observable <SubGrupoProducto[]> {

  let apiURL = `${this.url}/${idAdmGrupoProducto}/subgrupos`; 
  return this.http.get<SubGrupoProducto[]>(apiURL);
}


registrar(grupoProducto: GrupoProducto) {

  return this.http.post(this.url, grupoProducto).pipe(
    tap(result => {
    }),
    catchError(this.handleError('registrar GrupoProducto', []))
  );
}

actualizar(grupoProductoActual: GrupoProducto) {

  const url = `${this.url}/${grupoProductoActual.idAdmGrupoProducto}`;

  return this.http.put(url, grupoProductoActual).pipe(
    tap(result => {
    }),
    catchError(this.handleError('actualizando GrupoProducto', []))
  );
}

eliminar(idAdmGrupoProducto: number) {

  const url = `${this.url}/${idAdmGrupoProducto}`;

  return this.http.delete(url).pipe(
    tap(result => {
    }),
    catchError(this.handleError('error eliminando GrupoProducto', []))
  );
}


  private handleError<T>(operation = 'operation', result ?: T) {
  return (error: any): Observable<T> => {
    console.error(error);
    return of(result as T);
  };
}

  private log(message: string) {
  console.log('UserService: ' + message);
}

}
