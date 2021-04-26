import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import {  Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CentroCostosModelo } from '../models/centro-costos';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
  providedIn: 'root'
})
export class CentroCostosService {

  URL_api: string = environment.apiUrl + "centrocostos";
  URL_api_todos: string = environment.apiUrl + "centrocostos";
  URL_api_todos_empregen: string = environment.apiUrl + "centrocostosempregerencia";

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getTodos(): Observable<CentroCostosModelo[]> {
    return this.http.get<CentroCostosModelo[]>(this.URL_api_todos)
      .pipe(
        tap(result => console.log(`Resultado CentroCostoes Exitoso`)),
        catchError(this.handleError('getTodosCentroCosto ', []))
      );
  }

  getTodosPorEmpresaGerencia(idComprasEmpresa: number, idGerencia: number) {
    return this.http.get<CentroCostosModelo[]>(this.URL_api_todos_empregen + "/" + idComprasEmpresa + "/" + idGerencia).toPromise()
        .then(data => {return data});
  }

  getDetalleCentroCosto(idGenCentroCostos: number) {
    return this.http.get<CentroCostosModelo>(this.URL_api + "/" + idGenCentroCostos)
      .pipe(
        tap(result => console.log(`Resultado DetalleCentroCosto Exitoso`)),
        catchError(this.handleError('getDetallePefil ', []))
      )
      ;
  }

  nuevoCentroCosto(CentroCosto: CentroCostosModelo) {
    return this.http.post(this.URL_api, CentroCosto).pipe(
      tap(result => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("CentroCosto ingresado", currentUser);
      }),
      catchError(this.handleError('setCentroCosto', []))
    );
  }


  actualizarCentroCosto(CentroCosto: CentroCostosModelo) {    
    return this.http.put<CentroCostosModelo>(this.URL_api + "/" + CentroCosto.idGenCentroCostos, CentroCosto).pipe(
      tap(result => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("CentroCosto actualizado", currentUser);
      }),
      catchError(this.handleError('setCentroCosto', []))
    );
  }

  eliminarCentroCosto(CentroCosto: CentroCostosModelo) {

    return this.http.delete(this.URL_api + "/" + CentroCosto.idGenCentroCostos).pipe(
      tap(result => {
     
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("CentroCosto Eliminado", currentUser);
      }),
      catchError(this.handleError('setCentroCosto', []))
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
