import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { EmpresaCompras } from '../models/empresa-compras';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
	providedIn: 'root'
})
export class EmpresacomprasService {

	URL_api: string = environment.comprasUrl + "empresas/";
/*
	URL_api_todos: string = environment.apiUrl + "empresacompras";
	URL_api_todos_porgerencia: string = environment.apiUrl + "empresacomprasgerencia";
	URL_todas: string = environment.apiUrl + "empresacomprastodas";
*/
	//compras_empresa.php

	constructor(private http: HttpClient, private srvlog: LogTransacService) { }

	getTodos() {
		/*return this.http.get<EmpresaCompras[]>(this.URL_api_todos)
		  .pipe(
			tap(result => console.log(`Resultado Empresaes Exitoso`)),
			catchError(this.handleError('getTodosEmpresa ', []))
		  );*/
		return this.http.get<EmpresaCompras[]>(this.URL_api + 'sinfiltro').toPromise()
			//.then(data => { return data; })
			.catch();
	}

	getAll() {
		return this.http.get<EmpresaCompras[]>(this.URL_api + 'consultar');
		
	}

	getAllconCerradas() {
		/*return this.http.get<EmpresaCompras[]>(this.URL_api_todos)
		  .pipe(
			tap(result => console.log(`Resultado Empresaes Exitoso`)),
			catchError(this.handleError('getTodosEmpresa ', []))
		  );*/
		return this.http.get<EmpresaCompras[]>(this.URL_api + 'sinfiltro').toPromise()
			.then(data => { return data; })
			.catch();
	}

	getTodosPorGerencia(idGerencia: number, idArea: number) {
		return this.http.get<EmpresaCompras[]>(this.URL_api + "empresacomprasgerencia/" + idGerencia + "/" + idArea).toPromise()
			.then(data => { return data })
			.catch();
	}


	getDetalleEmpresaCompras(idGenEmpresa: number) {
		return this.http.get<EmpresaCompras[]>(this.URL_api + "filtrar/" + idGenEmpresa + '/?/?/?/?/?')
			.pipe(
				tap(result => console.log(`Resultado DetalleEmpresa Exitoso`)),
				catchError(this.handleError('getDetallePefil ', []))
			);

	}

	getDetalleEmpresaComprasP(idGenEmpresa: number): Promise<EmpresaCompras> {
		return this.http.get<EmpresaCompras>(this.URL_api + "filtrar/" + idGenEmpresa + '/////').toPromise();
	}

	nuevoEmpresaCompras(Empresa: EmpresaCompras) {
		/* return this.http.post(this.URL_api, Empresa).pipe(
		   tap(result => {
			 const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
			 this.srvlog.logearTransaccion("Empresa ingresado", currentUser);
		   }),
		   catchError(this.handleError('setEmpresa', []))
		 );*/
		return this.http.post(this.URL_api + 'insertar', Empresa).toPromise()
			.then(data => { return data; })
			.catch()
	}


	actualizarEmpresaCompras(Empresa: EmpresaCompras) {
		/*return this.http.put<EmpresaCompras>(this.URL_api + "/" + Empresa.IdComprasEmpresa, Empresa).pipe(
		  tap(result => {
			const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
			this.srvlog.logearTransaccion("Empresa actualizado", currentUser);
		  }),
		  catchError(this.handleError('setEmpresa', []))
		);*/
		return this.http.put<EmpresaCompras>(this.URL_api + "actualizar/" + Empresa.IdComprasEmpresa, Empresa).toPromise()
			.then(data => { return data; })
			.catch();
	}

	eliminarEmpresaCompras(Empresa: EmpresaCompras) {

		/*return this.http.delete(this.URL_api + "/" + Empresa.IdComprasEmpresa).pipe(
		  tap(result => {
			console.log('Empresa Eliminado');
			const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
			this.srvlog.logearTransaccion("Empresa Eliminado", currentUser);
		  }),
		  catchError(this.handleError('setEmpresa', []))
		);*/
		return this.http.delete(this.URL_api + "eliminar/" + Empresa.IdComprasEmpresa).toPromise()
			.then(data => { return data; })
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

