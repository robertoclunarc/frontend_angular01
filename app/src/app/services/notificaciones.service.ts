import { Injectable } from '@angular/core';
import { Notificacion, EstadoNotificacion } from '../models/index'
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { of } from "rxjs";
import { catchError, tap, filter, map } from 'rxjs/operators';



@Injectable({
	providedIn: 'root'
})
export class NotificacionesService {

	private url: string;
	notificacion: Notificacion;
	notificaciones: Notificacion[];


	constructor(private http: HttpClient) {

		this.url = environment.apiUrl + 'notificaciones'; //nsNotificacionServicio.php
	}

	getAllNotificacionesPorUsuario(id: number): Observable<Notificacion[]> {

		const url = `${this.url}/usuarios/${id}/todas`;

		const params = new HttpParams().set('accion', "0");

		return this.http.get<Notificacion[]>(url, { params })
			.pipe(
				catchError(this.handleError('getNotificacionesPorUsuario', []))
			);
	}

	getNotificacionesLeidas(id: number): Observable<Notificacion[]> {

		const url = `${this.url}/usuarios/${id}/todas`;

		const params = new HttpParams().set('accion', "1");

		return this.http.get<Notificacion[]>(url, { params })
			.pipe(
				catchError(this.handleError('getNotificacionesPorUsuario', []))
			);
	}

	getNotificacionesNoLeidas(id: number): Observable<Notificacion[]> {

		let apiUrl = `${this.url}/usuarios/${id}/todas`;
		let params = new HttpParams().set('accion', "2");

		return this.http.get<Notificacion[]>(apiUrl, { params });
	}

	getNotificacionesPorFecha(id: number, desde: string, hasta: string): Observable<Notificacion[]> {

		const url = `${this.url}/usuarios/${id}/todas`;

		const params = new HttpParams().set('accion', "3").set('desde', desde).set('hasta', hasta);

		return this.http.get<Notificacion[]>(url, { params })
			.pipe(
				catchError(this.handleError('getNotificacionesPorUsuario', []))
			);
	}


	getNotificacionesRecibidas(id: number): Observable<Notificacion[]> {

		let apiUrl = `${this.url}/usuarios/${id}/todas`;
		let params = new HttpParams().set('accion', "4");

		return this.http.get<Notificacion[]>(apiUrl, { params });
	}

	obtenerNotificacionesPorIdUsuario(id: any): Observable<Notificacion[]> {

		let apiUrl = `${this.url}/usuarios/${id}`;
		return this.http.get<Notificacion[]>(apiUrl);
	}


	obtenerUltNotificacionesPorUsuario(id: any): Observable<Notificacion[]> {

		let apiUrl = `${this.url}/usuarios/${id}/ultimas`;

		return this.http.get<Notificacion[]>(apiUrl);
	}


	enviarNotificacionPorServicio(mensaje: string, idUsuarioEnvio: number, idServicio: number) {

		const url = `${this.url}/enviar`;

		let notificacion: Notificacion;

		notificacion.accion = 1; // Notifica a todos los usuario segun el servicio/gerencia asociado
		notificacion.mensaje = mensaje;
		notificacion.usuarioEnvio = idUsuarioEnvio;
		notificacion.usuarioRecibe = -1;
		notificacion.servicio = idServicio;
		notificacion.rol = -1;

		return this.http.post(url, notificacion)
			.pipe(
				catchError(this.handleError('enviarNotificacionPorRol', notificacion))
			);
	}

	enviarNotificacionPorUsuario(mensaje: string, idUsuarioEnvio: number, idUsuarioDestino: number) {

		const url = `${this.url}/enviar`;

		let notificacion: Notificacion = {} ;

		notificacion.accion = 2; // Notifica a un usuario en particular
		notificacion.mensaje = mensaje;
		notificacion.usuarioEnvio = idUsuarioEnvio;
		notificacion.usuarioRecibe = idUsuarioDestino;
		notificacion.servicio = -1;
		notificacion.rol = -1;

		console.log("log desde", notificacion);
		
		return this.http.post(url, notificacion)
			.pipe(
				catchError(this.handleError('enviarNotificacionPorUsuario', notificacion))
			);

	}

	enviarNotificacionPorRol(mensaje: string, idUsuarioEnvio: number, idRol: number) {

		const url = `${this.url}/enviar`;

		let notificacion: Notificacion = {};

		notificacion.accion = 3; // Notifica a todos los usuario con el rol asignado
		notificacion.mensaje = mensaje;
		notificacion.usuarioEnvio = idUsuarioEnvio;
		notificacion.usuarioRecibe = -1;
		notificacion.servicio = -1;
		notificacion.rol = idRol;

		return this.http.post(url, notificacion)
			.pipe(
				catchError(this.handleError('enviarNotificacionPorRol', notificacion))
			);
	}




	nuevaNotificacion(mensaje: string, idServiciosGerencias: number, idSegRol: number, idUsuarioEnvio: number) {
		const url = `${this.url}`;

		let data = {
			'mensaje': mensaje,
			'idServiciosGerencias': idServiciosGerencias,
			'idSegRol': idSegRol,
			'idUsuarioEnvio': idUsuarioEnvio
		};

		//console.log("Data al servicio: ", data);

		return this.http.post(url, data)
			.pipe(
				catchError(this.handleError('nuevaNotificacion', data))
			);
	}

	nuevaNotificacionRecibe(mensaje: string, idUsuarioEnvio: number, idUsuarioRecibe: number, idServiciosGerencias: number) {

		const url = `${this.url}/recibe`;

		let data = {
			'mensaje': mensaje, 'idUsuarioEnvio': idUsuarioEnvio, 'idUsuarioRecibe': idUsuarioRecibe, 'idServiciosGerencias': idServiciosGerencias
		};

		return this.http.post(url, data)
			.pipe(
				catchError(this.handleError('nuevaNotificacionRecibe', data))
			);
	}


	actualizarEstadoNotificacion(idNotificacion: number, estado: EstadoNotificacion) {

		let apiUrl = `${this.url}/` + idNotificacion;
		return this.http.patch<Notificacion>(apiUrl, { "estado": estado });
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}

	private log(message: string) {
		//console.log('UserService: ' + message);
	}
}
