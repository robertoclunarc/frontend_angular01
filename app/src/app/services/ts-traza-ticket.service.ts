import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { TrazaTicketServicio } from '../models/traza-ticket-servicio';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
	providedIn: 'root'
})
export class TsTrazaTrazaService {

	URL_api: string = environment.apiUrl + "trazas";
	URL_api_todos: string = environment.apiUrl + "trazas";

	constructor(private http: HttpClient, private srvlog: LogTransacService) { }

	getTodos(): Observable<TrazaTicketServicio[]> {
		return this.http.get<TrazaTicketServicio[]>(this.URL_api_todos)
			.pipe(
				tap(result => console.log(`traza existoso`)),
				catchError(this.handleError('getTodosTraza ', []))
			);
	}

	nuevoTraza(traza: TrazaTicketServicio) {
		//console.table(traza);
		return this.http.post(this.URL_api, traza).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("TRAZA TICKET NRO " + traza.idTicketServicio, currentUser, 2);
			}),
			catchError(this.handleError('setTraza', []))
		);
	}

	async nuevoTrazaP(traza: TrazaTicketServicio) {
		//console.table(traza);
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("TRAZA TICKET NRO " + traza.idTicketServicio, currentUser, 2);
		return this.http.post(this.URL_api, traza).toPromise();
		
	}


	actualizarTraza(traza: TrazaTicketServicio) {
		//this.URL_api_actualizar += "/" + Traza.idTicektServicio;
		return this.http.put(this.URL_api + "/" + traza.idTrazaTicket, traza).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("Traza actualizado", currentUser);
			}),
			catchError(this.handleError('setTraza', []))
		);
	}

	eliminarTraza(Traza: TrazaTicketServicio) {

		return this.http.delete(this.URL_api + "/" + Traza.idTrazaTicket).pipe(
			tap(result => {
				console.log('Traza Eliminado');
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("Traza Eliminado", currentUser);
			}),
			catchError(this.handleError('setTraza', []))
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
