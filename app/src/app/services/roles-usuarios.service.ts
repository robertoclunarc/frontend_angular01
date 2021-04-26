import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { RolesNoAsignados } from '../models/roles-no-asignados';
import { RolesAsignadosUsrModelo } from '../models/roles-asignados-usr';
import { RolesUsuariosModelo } from '../models/roles-usuarios'


import { environment } from '../../../src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
  providedIn: 'root'
})
export class RolesUsuariosService  {

  private URL_api_no = environment.apiUrl + "nousuarioroles";
  private URL_api = environment.apiUrl + "usuarioroles";
  private URL_api_ma = environment.apiUrl + "usuariorol";
  private URL_api_usuariorol = environment.apiUrl + "usuarios-por-roles";


  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getRolesNoAsignados(idusuario: number): Observable<RolesNoAsignados[]> {
    return this.http.get<RolesNoAsignados[]>(this.URL_api_no + "/" + idusuario)
      .pipe(
        tap(result => console.log(`Roles NO ASIGNADOS`)),
        catchError(this.handleError('getRolesNoAsignados ', []))
      );
  }

  getRolesAsignados(idusuario: number){
    return this.http.get<RolesAsignadosUsrModelo[]>(this.URL_api + "/" + idusuario)
      .pipe(
        tap(result => console.log(`Roles ASIGNADOS`)),
        catchError(this.handleError('getRolesAsiganados ', []))
      );
  }

  getUsuariosPorRol(rol: string):Promise<RolesAsignadosUsrModelo[]>{
    //console.log("rol: ", rol);
    
    return this.http.get<RolesAsignadosUsrModelo[]>(this.URL_api_usuariorol + "/" + rol).toPromise();
  }
  

  insertarRolesAUsuario(rolesusuarios: RolesUsuariosModelo) {
    //console.table(rolesusuarios)
    return this.http.post(this.URL_api_ma, rolesusuarios)
      .pipe(
        tap(result => console.log(`Insertar Roles Usuario`)),
        catchError(this.handleError('insertarRolesAUsuario', []))
      );
  }

  eliminarRolesAUsuario(rolesusuarios: RolesUsuariosModelo) {
    //console.table(rolesusuarios);
    return this.http.delete(this.URL_api_ma + "/" + rolesusuarios.idSegUsuario+ "/" + rolesusuarios.idSegRol)
      .pipe(
        tap(result => console.log(`Eliminar Roles Usuario`)),
        catchError(this.handleError('EliminarRolesAUsuario ', []))
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
