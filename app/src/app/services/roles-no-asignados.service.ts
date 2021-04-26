import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { RolesNoAsignados } from '../models/roles-no-asignados';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
  providedIn: 'root'
})
export class RolesNoAsignadosService {

  //private rolesNoAsignados : RolesNoAsignados[] = [];

  private URL_api = environment.apiUrl + "noperfilroles";
  private URL_isertar = environment.apiUrl + "perfilrol";

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getRolesNoAsigandos(id_perfil: number): Observable<RolesNoAsignados[]>{
    return this.http.get<RolesNoAsignados[]>(this.URL_api + "/" + id_perfil)
    .pipe(
      tap(result => console.log(`Roles NO ASIGNADOS`)),
      catchError(this.handleError('getRolesNoAsigandos ', []))
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
