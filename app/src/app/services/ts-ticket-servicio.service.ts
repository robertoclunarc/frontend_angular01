import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { TicketServicio } from '../models/ticket-servicio';
import { TrazaTicketServicio } from '../models/traza-ticket-servicio';
import { ImgsTicketServicioModelo } from '../models/imgs-ticket-servicio';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
	providedIn: 'root'
})
export class TsTicketServicioService {

	URL_api: string = environment.apiUrl + "ticket";
	URL_api_todos: string = environment.apiUrl + "tickets";
	URL_api_porusr: string = environment.apiUrl + "ticketsporusr";
	URL_api_porgerencia: string = environment.apiUrl + "ticketsporgerencia";
	URL_api_enviados: string = environment.apiUrl + "ticketsenviados";
	URL_api_recibidos: string = environment.apiUrl + "ticketsrecibidos";
	URL_api_trazas: string = environment.apiUrl + "tickettrazas";
	URL_api_enviadosHis: string = environment.apiUrl + "ticketshisEnviados";
	URL_api_recibidosHis: string = environment.apiUrl + "ticketshisRecibidos";
	URL_insertar_imgs: string = environment.apiUrl + "imagsdbticket";
	URL_imagenes_ticket: string = environment.apiUrl + "getimgsticket";
	URL_dir_servidor: string = environment.apiUrl + "getimgsticket";
	URL_imagenes_esta: string = environment.apiUrl + "imagenyaregistrada"; //ts_ticket_servicio.php



	//private usersSubject = new BehaviorSubject([]);
	//private TicketesE : TicketModelo[] = [];

	private idTicketE : BehaviorSubject<string> = new BehaviorSubject("-1");
	private idTicket$ = this.idTicketE.asObservable();

	constructor(private http: HttpClient, private srvlog: LogTransacService) { }

	getTodos(): Observable<TicketServicio[]> {
		return this.http.get<TicketServicio[]>(this.URL_api_todos)
			.pipe(
				tap(result => console.log(`ticket existoso`)),
				catchError(this.handleError('getTodosTicket ', []))
			);
	}


	getOneTicket(idTicket : number): Observable<TicketServicio> {
		return this.http.get<TicketServicio>(this.URL_api_todos + `/${idTicket}`);
		
	}

	getTodosPorUsuario(idSegUsuario: number): Observable<TicketServicio[]> {
		return this.http.get<TicketServicio[]>(this.URL_api_porusr + "/" + idSegUsuario)
			.pipe(
				tap(result => console.log(`ticket por usuario existoso`)),
				catchError(this.handleError('getTodosTicketporUSR ', []))
			);
	}

	getTodosGerencia(idgerencia: number): Observable<TicketServicio[]> {
		return this.http.get<TicketServicio[]>(this.URL_api_porgerencia + "/" + idgerencia)
			.pipe(
				tap(result => console.log(`ticket por usuario existoso`)),
				catchError(this.handleError('getTodosTicketporUSR ', []))
			);
	}

	setDataidTicketObs(valor){
		this.idTicketE.next(valor);
	}

	getidTicket$(){
		return this.idTicket$;
	}

	getEnviados(idgerencia: number): Observable<TicketServicio[]> {
		return this.http.get<TicketServicio[]>(this.URL_api_enviados + "/" + idgerencia)
			.pipe(
				tap(result => console.log(`ticket por usuario existoso`)),
				catchError(this.handleError('getTodosTicketporUSR ', []))
			);
	}

	getRecibidios(idgerencia: number, iduser: number = -1) {

		return this.http.get<TicketServicio[]>(this.URL_api_recibidos + "/" + idgerencia + "/" + iduser).toPromise()
			.then(data => { return <TicketServicio[]>data; })
			.catch();
	}


	getRecibidiosHistorico(idgerencia: number): Promise<TicketServicio[]> {
		/*return this.http.get<TicketServicio[]>(this.URL_api_recibidosHis + "/" + idgerencia)
		  .pipe(
			tap(result => console.log(`ticket por usuario Historico existoso`)),
			catchError(this.handleError('getTodosTicketporUSR ', []))
		  );*/

		return this.http.get<TicketServicio[]>(this.URL_api_recibidosHis + "/" + idgerencia).toPromise();
	}


	getEnviadosHistorico(idgerencia: number): Observable<TicketServicio[]> {
		return this.http.get<TicketServicio[]>(this.URL_api_enviadosHis + "/" + idgerencia)
			.pipe(
				tap(result => console.log(`ticket por usuario Historico existoso`)),
				catchError(this.handleError('getTodosTicketporUSR ', []))
			);
	}


	getTrazasTicket(idTicektServicio: number) {
		return this.http.get<TrazaTicketServicio[]>(this.URL_api_trazas + "/" + idTicektServicio)
			.pipe(
				tap(result => console.log(`Resultado Trazas ticket Exitoso`)),
				catchError(this.handleError('getDetallePefil ', []))
			);
	}

	getImgsTicket(idTicketServicio: number) {
		return this.http.get<ImgsTicketServicioModelo[]>(this.URL_imagenes_ticket + "/" + idTicketServicio).pipe(
			tap(result => console.log(`Resultado Trazas ticket Exitoso`)),
			catchError(this.handleError('imagen del ticket', []))
		);
	}

	getImgsTicket2(idTicketServicio: number) {
		return this.http.get<ImgsTicketServicioModelo[]>(this.URL_imagenes_ticket + "/" + idTicketServicio).toPromise()
			.then(data => { return data; });

	}


	nuevoTicket(ticket: TicketServicio) {
		//console.table(ticket);
		return this.http.post(this.URL_api, ticket).pipe(
			tap(result => {
				//const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("TICKET NUEVO", {}, 1);
			}),
			catchError(this.handleError('setTicket', []))
		);
	}

	nuevoTicketP(ticket: TicketServicio) {
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("TICKET NUEVO", currentUser, 1);
		return this.http.post(this.URL_api, ticket).toPromise();
	}


	actualizarTicket(myticket: TicketServicio, tipoaccion = -1) {
		//this.URL_api_actualizar += "/" + Ticket.idTicektServicio;
		//console.table(myticket);
		return this.http.put(environment.apiUrl + "ticket/" + myticket.idTicketServicio, myticket).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("TICKET ACTUALIZADO " + myticket.idTicketServicio + " " + myticket.idEstadoActual, currentUser, tipoaccion);
			}),
			catchError(this.handleError('setTicket', []))
		);
	}


	anularTciket(idTicketServicio: number, tipoaccion = -1) {
		//this.URL_api_actualizar += "/" + Ticket.idTicektServicio;
		//console.table(myticket);
		return this.http.put(environment.apiUrl + "ticket/anular/" + idTicketServicio, {}).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("TICKET ANULADO " + idTicketServicio, currentUser, tipoaccion);
			}),
			catchError(this.handleError('setTicket', []))
		);
	}


	updateTicketSolped(id :number, ticket : TicketServicio) {
		return this.http.put( `${environment.apiUrl}ticket-solped/${id}`, ticket).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				
			}),
			catchError(this.handleError('setTicket', []))
		);
	}

	eliminarTicket(Ticket: TicketServicio) {
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("TICKET ELIMINADO", currentUser, 3);
		return this.http.delete(this.URL_api + "/" + Ticket.idTicketServicio).pipe(
			tap(result => {
				

			}),
			catchError(this.handleError('setTicket', []))
		);
	}



	insertarImagen(img: ImgsTicketServicioModelo) {
		return this.http.post(this.URL_insertar_imgs, img).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("IMAGEN INGRESADA TICKET " + img.idTicketServicio, currentUser, 1);
			}),
			catchError(this.handleError('imagen del ticket', []))
		);
	}


	insertarImagenP(img: ImgsTicketServicioModelo) {
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("IMAGEN INGRESADA TICKET " + img.idTicketServicio, currentUser, 1);
		return this.http.post(this.URL_insertar_imgs, img).toPromise();
	}
	
	imagenYaInsertada(nombre: string): Promise<ImgsTicketServicioModelo[]> {
		return this.http.get<ImgsTicketServicioModelo[]>(this.URL_imagenes_esta + "/" + nombre).toPromise();
	}

	//---------------Manejo de Errores
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}

}
