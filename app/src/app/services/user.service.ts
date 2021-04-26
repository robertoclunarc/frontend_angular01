import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../models/index';
import { Observable, of } from 'rxjs';
import {forkJoin} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LogTransacService } from '../services/logtransac.service';


@Injectable()
export class UserService {

  private url: string;
  private URL_api_quitarImg: string;
  private url_api_user_veri_gerencias: string;
  private url_xgere = environment.apiUrl + 'usuariosgerencia';

  constructor(private http: HttpClient, private srvlog: LogTransacService) {
    this.url = environment.apiUrl + 'usuarios';
    this.URL_api_quitarImg = environment.apiUrl +  'quitarimagenusr/';
    this.url_api_user_veri_gerencias = environment.apiUrl +  'usuariosverificagerencia';
    this.url_xgere = environment.apiUrl +  'usuariosgerencia';
  }


  getAll(): Observable<User[]> {
   
    return this.http.get<User[]>(this.url)
      .pipe(
        tap(result => this.log(`fetched users`)),
        catchError(this.handleError('getInvoices', []))
      );
  }

  getPorGerencias(idSegGerencia: number): Promise<User[]>{
    return this.http.get<User[]>(this.url_xgere + "/" + idSegGerencia).toPromise();
  }
  
  getUserById(id: number): Observable<User[]> {
    const url = `${this.url}/${id}`;

    return this.http.get<User[]>(url)
      .pipe(
        tap(result => this.log(`fetched User`)),
        catchError(this.handleError('getUserId', []))
      );
  }


  eliminarUsuario(usuario: User){
    return this.http.delete(this.url+ "/" + usuario.idSegUsuario).pipe(
      tap(result => {
        console.log('Usuario Eliminado');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("Usuario ELIMINADO", currentUser);
      }),
      catchError(this.handleError('setEli minarUsuario', []))
    );
  }

  eliminarImagenUsuario(nombreImagen: string) {

    return this.http.post(this.URL_api_quitarImg + nombreImagen, {}).pipe(
      tap(result => {
        console.log('ELIMINO IMAGEN');
        //const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        //this.srvlog.logearTransaccion("Noticia Eliminada", currentUser);
      }),
      catchError(this.handleError('NoticiaEliminada', [])) 
    );
  }

  nuevoUsuario(usuario: User) {
   
    return this.http.post(this.url, usuario).pipe(
      tap(result => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("usuario ingresado", currentUser);
      }),
      catchError(this.handleError('setUsuario', []))
    );
  }
  
  actualizarUsuario(usuario: User) {

    //console.log(usuario);
    //console.log(this.url + "/" + usuario.idSegUsuario);
    return this.http.put(this.url + "/" + usuario.idSegUsuario, usuario).pipe(
      tap(result => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.srvlog.logearTransaccion("usuario actualizado", currentUser);
      }),
      catchError(this.handleError('setUsuario', []))
    );
  }

  getUserConRolVerficarEnGerencia(idSegGerencia: number){
    return this.http.get(this.url_api_user_veri_gerencias + "/" +idSegGerencia).pipe(
      catchError(this.handleError('setUsuario', []))
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
