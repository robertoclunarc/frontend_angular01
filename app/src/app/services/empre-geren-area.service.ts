import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { environment } from 'src/environments/environment';
import { EmpreGerenArea } from "../models/empre-geren-area";


import {  Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmpreGerenAreaService {

  URL_api = environment.apiUrl + "empresagerenciaarea";
  URL_api_siesta = environment.apiUrl + "consultaSiIngresado";
  //config_empre_geren_area.php

  constructor(private http: HttpClient) { }

  getTodos(): Observable<EmpreGerenArea[]> {
    return this.http.get<EmpreGerenArea[]>(this.URL_api)
      .pipe(
        tap(result => console.log(`Resultado Roles Exitoso`)),
        catchError(this.handleError('getTodosRol ', []))
      );
  }


  getAll() {
    return this.http.get<EmpreGerenArea[]>(this.URL_api).toPromise()
      .then(data => { return data })
      .catch();
  }

  consultarIngresadas(empresa: number, gerencia: number, area: number) {
    return this.http.get<EmpreGerenArea[]>(this.URL_api_siesta + "/" + empresa + "/" + gerencia + "/" + area).toPromise()
      .then(data => { return data })
      .catch();
  }

  borrarEGA(ega : EmpreGerenArea){
    return this.http.delete(this.URL_api + "/" + ega.idGenEmpreAreaGeren).toPromise()
      .then(data => { return data })
      .catch();
  }

  insertarEGA(ega : EmpreGerenArea){
    return this.http.post(this.URL_api, ega).toPromise()
    .then(data => { return data })
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

