import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AplicabilidadProducto } from '../models/';

@Injectable({
	providedIn: 'root'
})
export class AplicabilidadService {

	private url: string;

	constructor(private http: HttpClient) {

		this.url = environment.apiUrl + 'aplicabilidad';
	}

	consultarTodos(): Observable<AplicabilidadProducto[]> {

		return this.http.get<AplicabilidadProducto[]>(this.url)
			.pipe(
				tap(result => this.log(`fetched ComplementariaProducto`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}

	consultarPorIdAdmProductoPadre(idAdmProductoPadre: number): Observable<AplicabilidadProducto[]> {

		const url = `${this.url}/${idAdmProductoPadre}`;

		return this.http.get<AplicabilidadProducto[]>(url)
			.pipe(
				tap(result => this.log(`fetched ComplementariaProducto`)),
				catchError(this.handleError('consultarPorId', []))
			);
	}


	registrar(complementariaProducto: AplicabilidadProducto) {
		return this.http.post(this.url, complementariaProducto).toPromise();
	}

	actualizar(complementariaProductoActual: AplicabilidadProducto) {

		const url = `${this.url}/${complementariaProductoActual.idAdmAplicabilidadProducto}`;
		return this.http.put(url, complementariaProductoActual).toPromise();
	}

	eliminar(idAdmComplementariaProducto: number) {
		const url = `${this.url}/${idAdmComplementariaProducto}`;
		return this.http.delete(url).toPromise();
	}


	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}

	private log(message: string) {
		console.log('UserService: ' + message);
	}
}
