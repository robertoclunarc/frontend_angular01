import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LogTransacModelo } from '../models/log';
import { User } from "../models/user";


@Injectable({
	providedIn: 'root'
})
export class LogTransacService {

	private newlog: LogTransacModelo = {};
	//private transacciones: LogTransacModelo[] = [];

	URL_api: string = environment.apiUrl + "log";
	URL_api_info_cliente: string = environment.apiUrl + "log/infocliente";
	URL_api_get: string = environment.apiUrl + "getlog";
	//currentUser : User = {};

	constructor(private http: HttpClient) { }

	getTransacc(modulo : number, accion? : number, rol? : number, desde?, hasta?){
		console.log("dir: ", this.URL_api_get + `/${modulo || -1}/${accion || -1}/${rol || -1}/${desde || -1}/${hasta || -1}`);
		
		return this.http.get<LogTransacModelo[]>(this.URL_api_get + `/${modulo || -1}/${accion || -1}/${rol || -1}/${desde || -1}/${hasta || -1}`).toPromise();
	}

	getTest(){
		//return this.http.get("http://localhost:5000/api/users").toPromise();
	}

	logearTransaccion(observacion?: string, usuario?: User, idaccion?: number, rolnombre?: string) {

		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));		
		const rol = (JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == rolnombre))
		const modulos = (JSON.parse(localStorage.getItem('breadCrumbComplete')));
		const modulo = (modulos[modulos.length - 1]);
		//console.log("Modulo: ", modulo);
		//console.table(currentUser);
		this.http.get(this.URL_api_info_cliente).subscribe(
			data => {
				this.newlog.ipPc = data.toString();
			}
		);

		this.newlog.observacion = observacion;
		this.newlog.idSegUsuario = currentUser.idSegUsuario;
		this.newlog.idSegRol = (rol == undefined) ? -1 : rol.idSegRol;
		this.newlog.idTipoAccion = idaccion || -1;
		this.newlog.idGerencia = currentUser.idGerencia;
		this.newlog.idSegMenu = modulo.idSegMenu;

		this.http.post(this.URL_api, this.newlog).subscribe();

	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}
}
