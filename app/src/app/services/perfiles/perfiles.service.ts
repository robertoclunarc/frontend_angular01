import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { PerfilModelo } from '../../models/perfil';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../logtransac.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  URL_api: string = environment.apiUrl + "perfiles";

  private usersSubject = new BehaviorSubject([]);
  //private PerfilesE : PerfilModelo[] = [];

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getTodos(): Observable<PerfilModelo[]> {
    return this.http.get<PerfilModelo[]>(this.URL_api)
      .pipe(
        tap(result => console.log(`Resultado Perfiles Exitoso`)),
        catchError(this.handleError('getTodosPerfil ', []))
      );
  }

  getDetallePefil(idSegPerfil: number){
    return this.http.get<PerfilModelo>(this.URL_api + "/" + idSegPerfil)
      .pipe(
        tap(result => console.log(`Resultado DetallePerfil Exitoso`)),
        catchError(this.handleError('getDetallePefil ', []))
      )
      ;
  }

  nuevoPerfil(perfil: PerfilModelo) {
    return this.http.post(this.URL_api, perfil).pipe(
      tap(result => {
        console.log('perfil ingresado');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("perfil ingresado", currentUser);
      }),
      catchError(this.handleError('setUsuario', []))
    );
  }


  actualizarPerfil(perfil: PerfilModelo) {
    //console.table(perfil);
    return this.http.put(this.URL_api + "/" + perfil.idSegPerfil, perfil).pipe(
      tap(result => {
        console.log('perfil actualizado');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("perfil actualizado", currentUser);
      }),
      catchError(this.handleError('setUsuario', []))
    );
  }

  eliminarPerfil(perfil: PerfilModelo) {
    //console.log(perfil);
    return this.http.delete(this.URL_api + "/" + perfil.idSegPerfil).pipe(
      tap(result => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("perfil eliminado", currentUser);
      }),
      catchError(this.handleError('setUsuario', []))
    );
  }



  //---------------Manejo de Errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //console.error(error);
      return of(result as T);
    };
  }


  /*
   
    getPerfilesEx(): Observable<PerfilModelo[]> {
      return this.usersSubject.asObservable();
    }
  
    private refresh() {
      this.usersSubject.next(this.PerfilesE);
    }
  
    loadData() {
      this.http.get<PerfilModelo[]>(this.URL_api).subscribe(
        data => {this.PerfilesE = data, this.refresh();}
        
      ) ;
      
    }
    */

}
