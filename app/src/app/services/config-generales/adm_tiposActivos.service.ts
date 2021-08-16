
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Iadm_tiposactivos} from '../../models/config-generales/Iadm_tiposActivos';

@Injectable({
	providedIn: 'root'
})
export class AdmTiposActivosService {
	private url: string;
	admTiposActivo: Iadm_tiposactivos = { };
	tiposActivos: Iadm_tiposactivos[];
	
	constructor(private http: HttpClient) {
		this.url = environment.admCatalogoUrl + 'tipos-activos';
	}


	consultarTodos(): Observable<Iadm_tiposactivos[]> {

		return this.http.get<Iadm_tiposactivos[]>(this.url + '/consultar')
			.pipe(
				tap(result => this.log(`fetched Tipos Activos`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}	

	registrar(tiposActivo: Iadm_tiposactivos) {
		return this.http.post<Iadm_tiposactivos>(this.url + '/insertar', tiposActivo).pipe(
			tap(result => { this.admTiposActivo = result; this.log(`Tipos Activo insertado`) }),
			catchError(this.handleError('registrar activo', []))
		);
	}	

	actualizar(tiposActivo: Iadm_tiposactivos) {
		const url = `${this.url}/actualizar/${tiposActivo.idAdmTipoActivo}`;

		return this.http.put(url, tiposActivo).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando Tipo Activo', []))
		);
	}	

	eliminar(idAdmTipoActivo: number) {
		const url = `${this.url}/eliminar/${idAdmTipoActivo}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando Tipo Activo', []))
		);
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