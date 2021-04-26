import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { RolesNoAsignados } from '../models/roles-no-asignados';
import { RolesAsignados } from '../models/roles-asignados';
import { RolesPerfiles } from '../models/roles-perfiles';


import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';


@Injectable({
  providedIn: 'root'
})
export class RolesPerfilesService {

  private URL_api_no = environment.apiUrl + "noperfilroles";
  private URL_api = environment.apiUrl + "perfilroles";
  private URL_api_ma = environment.apiUrl + "perfilrol";

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getRolesNoAsignados(id_perfil: number): Observable<RolesNoAsignados[]> {
    return this.http.get<RolesNoAsignados[]>(this.URL_api_no + "/" + id_perfil)
      .pipe(
        tap(result => console.log(`Roles NO ASIGNADOS`)),
        catchError(this.handleError('getRolesNoAsignados ', []))
      );
  }

  getRolesAsignados(id_perfil: number): Observable<RolesAsignados[]> {
    return this.http.get<RolesAsignados[]>(this.URL_api + "/" + id_perfil)
      .pipe(
        tap(result => console.log(`Roles ASIGNADOS`)),
        catchError(this.handleError('getRolesAsiganados ', []))
      );
  }

  insertarRolesAPerfil(rolesperfiles: RolesPerfiles) {
    return this.http.post(this.URL_api_ma, rolesperfiles)
      .pipe(
        tap(result => console.log(`Insertar Roles Perfiles`)),
        catchError(this.handleError('insertarRolesAPerfil ', []))
      );
  }

  eliminarRolesAPerfil(rolesperfiles: RolesPerfiles) {
    return this.http.delete(this.URL_api_ma + "/" + rolesperfiles.idSegPerfil + "/" + rolesperfiles.idSegRol)
      .pipe(
        tap(result => console.log(`Insertar Roles Perfiles`)),
        catchError(this.handleError('insertarRolesAPerfil ', []))
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
