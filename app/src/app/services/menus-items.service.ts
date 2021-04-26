import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { MenusItems } from "../models/menus-items"
import { Menu } from "../models/menu"
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
  providedIn: 'root'
})
export class MenusItemsService {

  api_URL: string = environment.apiUrl + "menusitems";
  api_URL_detalleMenu: string = environment.apiUrl + "menus";

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  obtenerMenusSonItems() {
    return this.http.get<MenusItems[]>(this.api_URL)
      .pipe(
        tap(result => console.log(`menu del desplegable`)),
        catchError(this.handleError('menu del desplegable ', []))
      );
  }

  obtenerDetalleMenu(idSegMenu: number){
    return this.http.get<Menu>(this.api_URL_detalleMenu + "/" + idSegMenu)
      .pipe(
        tap(result => console.log(`detalle del menu en roles`)),
        catchError(this.handleError('detalle del menu en roles', []))
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
