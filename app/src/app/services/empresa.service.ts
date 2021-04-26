import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { EmpresaModelo } from '../models/empresa';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
	providedIn: 'root'
})
export class EmpresaService {

	URL_api: string = environment.apiUrl + "empresa";
	URL_api_todos: string = environment.apiUrl + "empresa";

	constructor(private http: HttpClient, private srvlog: LogTransacService) { }

	getTodos() {
		/*return this.http.get<EmpresaModelo[]>(this.URL_api_todos)
		  .pipe(
			tap(result => console.log(`Resultado Empresaes Exitoso`)),
			catchError(this.handleError('getTodosEmpresa ', []))
		  );*/
		return this.http.get<EmpresaModelo[]>(this.URL_api_todos).toPromise()
			.then(data => { return data })
			.catch();
	}



	getDetalleEmpresa(idGenEmpresa: number) {
		return this.http.get<EmpresaModelo>(this.URL_api + "/" + idGenEmpresa)
			.pipe(
				tap(result => console.log(`Resultado DetalleEmpresa Exitoso`)),
				catchError(this.handleError('getDetallePefil ', []))
			)
			;
	}

	nuevoEmpresa(Empresa: EmpresaModelo) {
		return this.http.post(this.URL_api, Empresa).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("Empresa ingresado", currentUser);
			}),
			catchError(this.handleError('setEmpresa', []))
		);
	}


	actualizarEmpresa(Empresa: EmpresaModelo) {
		return this.http.put<EmpresaModelo>(this.URL_api + "/" + Empresa.IdGenEmpresa, Empresa).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("Empresa actualizado", currentUser);
			}),
			catchError(this.handleError('setEmpresa', []))
		);
	}

	eliminarEmpresa(Empresa: EmpresaModelo) {

		return this.http.delete(this.URL_api + "/" + Empresa.IdGenEmpresa).pipe(
			tap(result => {
				console.log('Empresa Eliminado');
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("Empresa Eliminado", currentUser);
			}),
			catchError(this.handleError('setEmpresa', []))
		);
	}

	//---------------Manejo de Errores
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}

}
