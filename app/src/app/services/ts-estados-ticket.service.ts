import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { EstadoTicket } from '../models/estado-ticket';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
  providedIn: 'root'
})
export class TsEstadosTicketService {

  URL_api: string = environment.apiUrl + "estadosticket";
  URL_api_todos: string = environment.apiUrl + "estadosticket";
  URL_api_porOrden: string = environment.apiUrl + "estadoticketorden";
  URL_api_sigui : string = environment.apiUrl + "estadossiguientes";
  URL_api_recibidos : string = environment.apiUrl + "estadosrecibidos";
  URL_api_reci : string = environment.apiUrl + "verrecibidos";
  URL_api_actuaysig : string = environment.apiUrl + "estadosactualysig";
  URL_estadosHisRecibidos : string = environment.apiUrl + "estadoshisrecibidos";

  //private usersSubject = new BehaviorSubject([]);
  //private TicketesE : TicketModelo[] = [];

  constructor(private http: HttpClient, private srvlog: LogTransacService) { }

  getTodos(): Observable<EstadoTicket[]> {
    return this.http.get<EstadoTicket[]>(this.URL_api_todos)
      .pipe(
        tap(result => console.log(`estados existoso`)),
        catchError(this.handleError('getTodosTicket ', []))
      );
  }

  getOrdenporEstado(idestado : number):  Promise<EstadoTicket[]>{
    return this.http.get<EstadoTicket[]>(this.URL_api + "/" + idestado).toPromise();
  }

  getEstadoUnOrden(orden: number) {
    return this.http.get<EstadoTicket>(this.URL_api_porOrden + "/" + orden)
      .pipe(
        tap(result => console.log(`estados existoso`)),
        catchError(this.handleError('getTodosTicket ', []))
      );
  }

  getEstadoUnOrdenP(orden: number) {
    return this.http.get<EstadoTicket>(this.URL_api_porOrden + "/" + orden).toPromise();
  }

  getEstadosSiguientes(idTicektServicio : number, emisor_o_recep : number) {
    return this.http.get<EstadoTicket[]>(this.URL_api_sigui + "/" + idTicektServicio + "/" + emisor_o_recep)
      .pipe(
        tap(result => console.log(`estados siguientes existoso`)),
        catchError(this.handleError('getTodosSiguientesTicket ', []))
      );
  }

  getEstadosRecibidos(idTicektServicio : number, emisor_o_recep : number) {
  
    return this.http.get<EstadoTicket[]>(this.URL_api_reci + "/" + idTicektServicio + "/" + emisor_o_recep)
      .pipe(
        tap(result => console.log(`estados siguientes existoso`)),
        catchError(this.handleError('getTodosSiguientesTicket ', []))
      );
  }

  obtenerEstadoSiguiente(idTicektServicio : number, aprobado : number) {
    return this.http.get<EstadoTicket[]>(this.URL_api_actuaysig + "/" + idTicektServicio + "/" + aprobado)
      .pipe(
        tap(result => console.log(`estados siguientes existoso`)),
        catchError(this.handleError('getTodosSiguientesTicket ', []))
      );
  }

  getEstadosFiltrosHisRecibidos(): Promise<EstadoTicket[]>{
    return this.http.get<EstadoTicket[]>(this.URL_estadosHisRecibidos).toPromise();
  }
  
  nuevoEstado(estadoTicket: EstadoTicket) {
    return this.http.post(this.URL_api, estadoTicket).pipe(
      tap(result => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("estados Ticket ingresado", currentUser);
      }),
      catchError(this.handleError('setTicket', []))
    );
  }


  actualizarEstado(estadoTicket: EstadoTicket) {
    //this.URL_api_actualizar += "/" + Ticket.idTicektServicio;
    return this.http.put(this.URL_api + "/" + estadoTicket.idEstadoTicket, estadoTicket).pipe(
      tap(result => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("Ticket actualizado", currentUser);
      }),
      catchError(this.handleError('setTicket', []))
    );
  }

  eliminarEstado(estadoTicket: EstadoTicket) {

    return this.http.delete(this.URL_api + "/" + estadoTicket.idEstadoTicket).pipe(
      tap(result => {
        console.log('Ticket Eliminado');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("Ticket Eliminado", currentUser);
      }),
      catchError(this.handleError('setTicket', []))
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
