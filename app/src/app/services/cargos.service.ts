import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { CargosModelo } from '../models/cargos';
import { environment } from '../../../src/environments/environment'

@Injectable({
	providedIn: 'root'
})
export class CargosService {

	URL_api: string = environment.apiUrl + "cargos";
	URL_api_todos: string = environment.apiUrl + "cargos";

	//private usersSubject = new BehaviorSubject([]);
	//private cargoesE : CargosModelo[] = [];

	constructor(private http: HttpClient) { }

	getTodos(): Observable<CargosModelo[]> {
		return this.http.get<CargosModelo[]>(this.URL_api)
			.pipe(
				tap(result => console.log(`Resultado cargoes Exitoso`)),
				catchError(this.handleError('getTodoscargo ', []))
			);
	}

	getDetallecargo(idConfigCargo: number) {
		return this.http.get<CargosModelo>(this.URL_api + "/" + idConfigCargo)
			.pipe(
				tap(result => console.log(`Resultado detalleGerncia Exitoso`)),
				catchError(this.handleError('getDetallePefil ', []))
			);
	}

	getDetallecargoP(idConfigCargo: number) {
		return this.http.get<CargosModelo>(this.URL_api + "/" + idConfigCargo).toPromise();
	}

	nuevocargo(cargo: CargosModelo) {
		return this.http.post(this.URL_api, cargo).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				//this.srvlog.logearTransaccion("cargo ingresado", currentUser);
			}),
			catchError(this.handleError('setcargo', []))
		);
	}


	actualizarcargo(cargo: CargosModelo) {
		//this.URL_api_actualizar += "/" + cargo.idConfigCargo;
		return this.http.put(this.URL_api + "/" + cargo.idConfigCargo, cargo).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				//this.srvlog.logearTransaccion("cargo actualizado", currentUser);
			}),
			catchError(this.handleError('setcargo', []))
		);
	}

	eliminarcargo(cargo: CargosModelo) {

		return this.http.delete(this.URL_api + "/" + cargo.idConfigCargo).pipe(
			tap(result => {
				console.log('cargo Eliminado');
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				//this.srvlog.logearTransaccion("cargo Eliminado", currentUser);
			}),
			catchError(this.handleError('setcargo', []))
		);
	}

	persona_cargo(idGerencia: number, cargo: string) {
		return this.http.get<User>(environment.apiUrl + `persona-cargo/${idGerencia}/${cargo}`);
	}
	//---------------Manejo de Errores
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}

}
