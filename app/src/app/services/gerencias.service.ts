import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { GerenciasModelo } from '../models/gerencias';
import { environment } from 'src/environments/environment';
import { AreaTrabajo } from '../models';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
  providedIn: 'root'
})
export class GerenciasService {

  URL_api: string = environment.apiUrl + "gerencias";
  URL_api_sinActual: string = environment.apiUrl + "gerenciassinactual";
  URL_api_todos: string = environment.apiUrl + "gerencias";

  //private usersSubject = new BehaviorSubject([]);
  //private gerenciaesE : GerenciasModelo[] = [];

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getTodos() {
   
    return this.http.get<GerenciasModelo[]>(this.URL_api).toPromise()
      .then(data => { return data; })
      .catch();
  }

  getTodosSinActual(idConfigGerencia: number): Observable<GerenciasModelo[]> {
    return this.http.get<GerenciasModelo[]>(this.URL_api_sinActual + "/" + idConfigGerencia)
      .pipe(
        tap(result => console.log(`Resultado gerenciaes Exitoso`)),
        catchError(this.handleError('getTodosgerencia ', []))
      );
  }

  getGerenciasFiltros(): Promise<GerenciasModelo[]>{
    //Se coloco para que no de error el "getTodos"
    return this.http.get<GerenciasModelo[]>(this.URL_api).toPromise();      
  }

  getDetalleGerencia(idConfigGerencia: number) {
    return this.http.get<GerenciasModelo>(this.URL_api + "/" + idConfigGerencia)
      .pipe(
        tap(result => console.log(`Resultado detalleGerncia Exitoso`)),
        catchError(this.handleError('getDetallePefil ', []))
      );
  }

  
  getAreasTrabajoGerencia(idConfigGerencia: number) : Observable<AreaTrabajo[]>{

    const url = `${this.URL_api}/${idConfigGerencia}/areasTrabajo`;

    return this.http.get<AreaTrabajo[]>(url)
      .pipe(
        tap(result => console.log(`Resultado areas gerencias Exitoso`)),
        catchError(this.handleError('getAreasTrabajoGerencia ', []))
      );
  }

  nuevoGerencia(gerencia: GerenciasModelo) {
    /*return this.http.post(this.URL_api, gerencia).pipe(
      tap(result => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        //this.srvlog.logearTransaccion("gerencia ingresado", currentUser);
      }),
      catchError(this.handleError('setgerencia', []))
    );*/

    return this.http.post<GerenciasModelo>(this.URL_api, gerencia).toPromise()
      .then(data => { return data; })
      .catch();
  }


  actualizarGerencial(gerencia: GerenciasModelo) {
    //this.URL_api_actualizar += "/" + gerencia.idConfigGerencia;
    /* return this.http.put(this.URL_api + "/" + gerencia.idConfigGerencia, gerencia).pipe(
       tap(result => {
         const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
         //this.srvlog.logearTransaccion("gerencia actualizado", currentUser);
       }),
       catchError(this.handleError('setgerencia', []))
     );*/
    return this.http.put(this.URL_api + "/" + gerencia.idConfigGerencia, gerencia).toPromise()
      .then(data => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("gerencia actualizado", currentUser);
        return data;
      })
      .catch();
  }

  eliminarGerencia(gerencia: GerenciasModelo) {

    /* return this.http.delete(this.URL_api + "/" + gerencia.idConfigGerencia).pipe(
       tap(result => {
         console.log('gerencia Eliminado');
         const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
         this.srvlog.logearTransaccion("gerencia Eliminado", currentUser);
       }),
       catchError(this.handleError('setgerencia', []))
     );*/
    return this.http.delete(this.URL_api + "/" + gerencia.idConfigGerencia).toPromise()
      .then(result => {
        console.log('gerencia Eliminado');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("gerencia Eliminado", currentUser);
      })
      .catch();

  }

  //---------------Manejo de Errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
