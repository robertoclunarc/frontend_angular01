import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { PerfilesNoasignados } from '../models/perfiles-noasignados';
import { PerfilesAsignadosModelo } from '../models/perfiles-asignados';
import { PerfilesUsuarioModelo } from '../models/perfiles-usuario'


import { environment } from '../../../src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';
@Injectable({
  providedIn: 'root'
})
export class PerfilesUsuarioService {

  private URL_api_no = environment.apiUrl + "noperfilesusuario";
  private URL_api = environment.apiUrl + "perfilesusuarios";
  private URL_api_ma = environment.apiUrl + "perfilusuario";
  private URL_api_asigporperfil = environment.apiUrl + "porperfil";

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getPerfilesNoAsignados(idusuario: number): Observable<PerfilesNoasignados[]> {
    return this.http.get<PerfilesNoasignados[]>(this.URL_api_no + "/" + idusuario)
      .pipe(
        tap(result => console.log(`PERFILES NO ASIGNADOS`)),
        catchError(this.handleError('PERFILES ', []))
      );
  }

  getPerfilesAsignados(idusuario: number) {
    return this.http.get<PerfilesAsignadosModelo[]>(this.URL_api + "/" + idusuario)
      .pipe(
        tap(result => console.log(`PERFILES ASIGNADOS`)),
        catchError(this.handleError('PERFILES ', []))
      );
  }

  insertarPerfilesAUsuario(usrPerfil: PerfilesUsuarioModelo) {
    return this.http.post(this.URL_api_ma, usrPerfil)
      .pipe(
        tap(result => console.log(`Insertar PERFILES Usuario`)),
        catchError(this.handleError('insertarPERFILESAUsuario', []))
      );
  }

  eliminarPerfilesAUsuario(usrPerfil: PerfilesUsuarioModelo) {

    return this.http.delete(this.URL_api_ma + "/" + usrPerfil.idSegPerfil + "/" + usrPerfil.idSegUsuario)
      .pipe(
        tap(result => console.log(`Eliminar PERFILES Usuario`)),
        catchError(this.handleError('Eliminar PERFILESAUsuario ', []))
      );
  }


  getPerfilesAsignadosPorPerfil(idSegPerfil: number) {
    return this.http.get<PerfilesAsignadosModelo[]>(this.URL_api_asigporperfil + "/" + idSegPerfil)
      .pipe(
        tap(result => console.log(`PERFILES ASIGNADOS`)),
        catchError(this.handleError('PERFILES ', []))
      );
  }


  //---------------Manejo de Errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //console.error(error);
      return of(result as T);
    };
  }
}
