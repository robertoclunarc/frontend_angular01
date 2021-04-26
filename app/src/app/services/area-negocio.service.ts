import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AreaNegocioModelo } from '../models/area-negocio';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';


@Injectable({
	providedIn: 'root'
})
export class AreaNegocioService {

	URL_api: string = environment.apiUrl + "areanegocio";
	URL_api_todos: string = environment.apiUrl + "areanegocio";
	URL_api_todos_gerencias: string = environment.apiUrl + "areanegociogerencia";


	constructor(private http: HttpClient, private srvlog: LogTransacService) { }

	getTodos(): Observable<AreaNegocioModelo[]> {
		return this.http.get<AreaNegocioModelo[]>(this.URL_api_todos)
			.pipe(
				tap(result => console.log(`Resultado AreaNegocioes Exitoso`)),
				catchError(this.handleError('getTodosAreaNegocio ', []))
			);
	}

	getAll() {
		return this.http.get<AreaNegocioModelo[]>(this.URL_api_todos)
			.toPromise().then(data => { return data; })
			.catch();
	}

	getAll2(): Observable<AreaNegocioModelo[]> {
		return this.http.get<AreaNegocioModelo[]>(this.URL_api_todos);
			//.toPromise().then(data => { return data; })
			//.catch();
	}

	getAll3(): Promise<AreaNegocioModelo[]> {
		return this.http.get<AreaNegocioModelo[]> (this.URL_api_todos)
			//.map(data => {  return data })
			.toPromise();			
	}
	
	getTodosPorGerencias(idGernecia: number) {
		return this.http.get<AreaNegocioModelo[]>(this.URL_api_todos_gerencias + "/" + idGernecia).toPromise()
			.then(data => { return data; })
			.catch();
	}


	getDetalleAreaNegocio(idGenAreaNegocio: number) {
		return this.http.get<AreaNegocioModelo>(this.URL_api + "/" + idGenAreaNegocio)
			.pipe(
				tap(result => console.log(`Resultado DetalleAreaNegocio Exitoso`)),
				catchError(this.handleError('getDetallePefil ', []))
			)
			;
	}

	nuevoAreaNegocio(AreaNegocio: AreaNegocioModelo) {
		
		return this.http.post(this.URL_api, AreaNegocio).toPromise()
			.then()
			.catch();
	}

	nuevoAreaNegocio2(AreaNegocio: AreaNegocioModelo) {
	
		return this.http.post(this.URL_api, AreaNegocio).toPromise();
	}


	actualizarAreaNegocio(AreaNegocio: AreaNegocioModelo) {

		return this.http.put<AreaNegocioModelo>(this.URL_api + "/" + AreaNegocio.idGenAreaNegocio, AreaNegocio).toPromise()
			.then()
			.catch();
	}

	eliminarAreaNegocio(AreaNegocio: AreaNegocioModelo) {

		return this.http.delete(this.URL_api + "/" + AreaNegocio.idGenAreaNegocio).toPromise()
			.then()
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
