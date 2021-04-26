import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NoticiaModelo, TicketServicio } from '../models/index';
import { Observable } from 'rxjs';
import { of } from "rxjs";

import { catchError, tap, map } from 'rxjs/operators';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
	providedIn: 'root'
})
export class NoticiasService {

	private URL_api: string;
	private URL_api_I: string;
	private URL_api_quitarImg: string;
	private URL_api_Public: string;

	constructor(private http: HttpClient, private srvlog: LogTransacService) {
		this.URL_api = environment.apiUrl + 'noticias';
		this.URL_api_Public = environment.apiUrl + 'noticiasPublico';
		this.URL_api_I = environment.apiUrl + 'noticia';
		this.URL_api_quitarImg = environment.apiUrl + 'quitarimagen/';
	}

	getAll(): Observable<NoticiaModelo[]> {

		return this.http.get<NoticiaModelo[]>(this.URL_api)
			/* .pipe(
				map((data)=>data.filter((noti)=>noti.idConfigNoticia == 6))
			); */
			/* .pipe(
				tap(result => this.log(`fetched noticias`)),
				catchError(this.handleError('getNoticias', []))
			); */ 
	}

	getAllPromise(): Promise<NoticiaModelo[]> {
		return this.http.get<NoticiaModelo[]>(this.URL_api).toPromise();
	}

	getAllPublico(): Observable<NoticiaModelo[]> {

		return this.http.get<NoticiaModelo[]>(this.URL_api_Public)
			.pipe(
				tap(result => this.log(`fetched noticias`)),
				catchError(this.handleError('getNoticias', []))
			);
	}

	getDetalleNoticia(idConfigNoticia: number) {
		return this.http.get<NoticiaModelo>(this.URL_api_I + "/" + idConfigNoticia)
			.pipe(
				tap(result => console.log(`Resultado DetalleNoticia Exitoso`)),
				catchError(this.handleError('getDetalleNoticia ', []))
			)
			;
	}

	nuevoNoticia(Noticia: NoticiaModelo) {
		return this.http.post(this.URL_api_I, Noticia).pipe(
			tap(result => {
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("Noticia ingresada", currentUser);
			}),
			catchError(this.handleError('NoticiaIngresa', []))
		);
	}

	nuevaNoticiaP(Noticia: NoticiaModelo): Promise<NoticiaModelo> {
		return this.http.post<NoticiaModelo>(this.URL_api_I, Noticia).toPromise(); 
	}


	actualizarNoticia(Noticia: NoticiaModelo) {
		//this.URL_api_actualizar += "/" + Rol.idConfigNoticia;
		return this.http.put(this.URL_api_I + "/" + Noticia.idConfigNoticia, Noticia).pipe(
			tap(result => {

				//console.log(idrol);
				this.srvlog.logearTransaccion("Noticia actualizada nro:" + Noticia.idConfigNoticia, {}, 2, "ROL-VC-NOTICIAS");
			}),
			catchError(this.handleError('Noticia', []))
		);
	}

	actualizarNoticiaP(Noticia: NoticiaModelo): Promise<NoticiaModelo> {
		//this.URL_api_actualizar += "/" + Rol.idConfigNoticia;
		return this.http.put<NoticiaModelo>(this.URL_api_I + "/" + Noticia.idConfigNoticia, Noticia).toPromise();
	}

	eliminarImagenNoticia(nombreImagen: string) {

		return this.http.post(this.URL_api_quitarImg + nombreImagen, {}).pipe(
			tap(result => {
				//console.log('ELIMINO IMAGEN');
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("Noticia Eliminada", currentUser);
			}),
			catchError(this.handleError('NoticiaEliminada', []))
		);
	}

	eliminarNoticia(noticia: NoticiaModelo) {

		return this.http.delete(this.URL_api_I + "/" + noticia.idConfigNoticia).pipe(
			tap(result => {
				console.log('Notiicia Eliminada');
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("Noticia Eliminada", currentUser);
			}),
			catchError(this.handleError('NoticiaEliminada', []))
		);
	}

	eliminarNoticiaP(noticia: NoticiaModelo) {
		return this.http.delete(this.URL_api_I + "/" + noticia.idConfigNoticia).toPromise();
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
