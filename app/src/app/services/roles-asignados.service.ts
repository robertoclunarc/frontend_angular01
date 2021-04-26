import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { RolesAsignados } from '../models/roles-asignados';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
  providedIn: 'root'
})
export class RolesAsignadosService {

  private URL_api = environment.apiUrl + "perfilroles";
 // private rolesNoAsignados : RolesAsignados[] = [];

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getRolesAsigandos(id_perfil: number): Observable<RolesAsignados[]>{
    return this.http.get<RolesAsignados[]>(this.URL_api + "/" + id_perfil)
    .pipe(
      tap(result => console.log(`Roles ASIGNADOS`)),
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
