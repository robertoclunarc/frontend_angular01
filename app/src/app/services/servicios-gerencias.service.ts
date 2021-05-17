import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { ServiciosGerenciasModelo } from "../models/servicios-gerencias";
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';


@Injectable({
    providedIn: 'root'
})
export class ServiciosGerenciasService {

    private URL_api: string;
    private URL_api_I: string = environment.apiUrl + 'serviciosgerencias';
    private URL_api_quitarImg: string;
    private URL_api_porgerencia: string;

    constructor(private http: HttpClient, private srvlog: LogTransacService) {
        this.URL_api = environment.apiUrl + 'serviciosgerencias';
        this.URL_api_I;
        this.URL_api_porgerencia = environment.apiUrl + 'serviciosporgerencias';
    }

    getAll() {

        /* return this.http.get<ServiciosGerenciasModelo[]>(this.URL_api)
           .pipe(
             tap(result => this.log(`fetched ServicioGerenciass`)),
             catchError(this.handleError('getServicioGerenciass', []))
           );*/
        return this.http.get<ServiciosGerenciasModelo[]>(this.URL_api).toPromise()
            .then(data => { return data; })
            .catch();
    }

    getDetalleServiciosGerencias(idConfigServicioGerencias: number) {

        return this.http.get<ServiciosGerenciasModelo[]>(this.URL_api_I + "/" + idConfigServicioGerencias).toPromise()
            .then(data => { return data; })
            .catch();
    }

    getServiciosUnaGerencia2(idGerencia: number) {
        return this.http.get<ServiciosGerenciasModelo[]>(this.URL_api_porgerencia + "/" + idGerencia).toPromise()
            .then(data => { return data; })
            .catch();
    }

    getServiciosUnaGerencia(idGerencia: number) {
        return this.http.get<ServiciosGerenciasModelo[]>(this.URL_api_porgerencia + "/" + idGerencia)
            .pipe(
                tap(result => console.log(`Resultado DetalleServicioGerencias Exitoso`)),
                catchError(this.handleError('getDetalleServicioGerencias ', []))
            )
            ;
    }

    nuevoServicioGerencias(ServicioGerencias: ServiciosGerenciasModelo) {
        /* return this.http.post(this.URL_api_I, ServicioGerencias).pipe(
             tap(result => {
                 const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                 this.srvlog.logearTransaccion("ServicioGerencias ingresada", currentUser);
             }),
             catchError(this.handleError('ServicioGerenciasIngresa', []))
         );*/
        return this.http.post(this.URL_api_I, ServicioGerencias).toPromise()
            .then(data => { return data })
            .catch();
    }


    actualizarServicioGerencias(ServicioGerencias: ServiciosGerenciasModelo) {
        //this.URL_api_actualizar += "/" + Rol.idConfigServicioGerencias;
        /*return this.http.put(this.URL_api_I + "/" + ServicioGerencias.idServiciosGerencias, ServicioGerencias).pipe(
            tap(result => {
                const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                this.srvlog.logearTransaccion("ServicioGerencias actualizado", currentUser);
            }),
            catchError(this.handleError('ServicioGerencias', []))
        );*/
        return this.http.put(this.URL_api_I + "/" + ServicioGerencias.idServiciosGerencias, ServicioGerencias).toPromise()
            .then(data => { return data; })
            .catch();
    }

    eliminarImagenServicioGerencias(nombreImagen: string) {

        return this.http.post(this.URL_api_quitarImg + nombreImagen, {}).pipe(
            tap(result => {
                
                //const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                //this.srvlog.logearTransaccion("ServicioGerencias Eliminada", currentUser);
            }),
            catchError(this.handleError('ServicioGerenciasEliminada', []))
        );
    }

    eliminarServicioGerencias(ServicioGerencias: ServiciosGerenciasModelo) {

        /*return this.http.delete(this.URL_api_I + "/" + ServicioGerencias.idServiciosGerencias).pipe(
            tap(result => {
                console.log('Notiicia Eliminada');
                const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                this.srvlog.logearTransaccion("ServicioGerencias Eliminada", currentUser);
            }),
            catchError(this.handleError('ServicioGerenciasEliminada', []))
        );*/
        return this.http.delete(this.URL_api_I + "/" + ServicioGerencias.idServiciosGerencias).toPromise()
            .then(data => {return data;})
            .catch();
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
