import { SolpedDetalleModelo } from './../models/solped-detalle';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { SolpedModelo } from '../models/solped';
import { environment } from 'src/environments/environment';
import { LogTransacService } from '../services/logtransac.service';

import { TreeNode } from "../models/treenode";


@Injectable({
	providedIn: 'root'
})
export class SolPedService {

	private URL_api: string = environment.apiUrl + "solped";
	private URL_api_todos: string = environment.apiUrl + "solped";
	private URL_api_solticket: string = environment.apiUrl + "solpedticket";
	private URL_api_arbol: string = environment.solpedURL + "solpedydetalles";
	private URL_nodeTodos: string = environment.solpedURL + "solped";
	private URL_asiganarSolped: string = environment.solpedURL + "asignacionsolped";
	private URL_misSolpeds: string = environment.solpedURL + "missolped";
	private URL_presidencia: string = environment.solpedURL + "solspresidencia";
	private URL_cambiofase: string = environment.solpedURL + "cambiofasesolped"; //
	private URL_afacturar: string = environment.solpedURL + "setempresafacturar"; //
	private URL_upFechaAprpSolpded: string = environment.solpedURL + "update-aprob-presi"; //
	private URL_delDetallesTodas: string = environment.solpedURL + "detallessolped"; //
	private URL_cantNoprocess: string = environment.solpedURL + "total-det-noprocess"; //

	private Solped: SolpedModelo = {};
	private BehSolped: BehaviorSubject<SolpedModelo> = new BehaviorSubject<SolpedModelo>({});
	//private BehSolped: BehaviorSubject<SolpedModelo> ; 
	//BehSolped: Subject<SolpedModelo> = new Subject<SolpedModelo>();
	//BehSolped: EventEmitter<SolpedModelo> = new EventEmitter<SolpedModelo>();
	solped$: Observable<SolpedModelo> = this.BehSolped.asObservable();

	constructor(private http: HttpClient, private srvlog: LogTransacService) {

	}

	//Metodos para el observable
	/*getObservableSolped(): Observable<SolpedModelo> {
		//return this.solped$;
	} */

	async getDataObsverver(idSolpedCompras: number) {
		const solped: SolpedModelo = await this.http.get<SolpedModelo>(this.URL_nodeTodos + "/" + idSolpedCompras).toPromise(); //await this.http.get<SolpedModelo>(this.URL_api + "/" + idSolpedCompras).toPromise()[0];
		const cantDetNoProcess: number = (await this.http.get(this.URL_cantNoprocess + "/" + idSolpedCompras).toPromise())["cant_noprocess"];
		solped.totDetallesNoProc = cantDetNoProcess;
		this.Solped = solped;
		//console.log("getdataobserver: ", solped);
		this.BehSolped.next(solped);
	}

	propagarData(solped: SolpedModelo) {
		this.BehSolped.next(solped);
	}

	//Metodos de acceso
	getTodos(): Observable<SolpedModelo[]> {
		return this.http.get<SolpedModelo[]>(this.URL_api_todos)
			.pipe(
				tap(result => console.log(`Resultado SolPedes Exitoso`)),
				catchError(this.handleError('getTodosSolPed ', []))
			);
	}
	getTodosP(): Promise<SolpedModelo[]> {
		return this.http.get<SolpedModelo[]>(this.URL_nodeTodos).toPromise();
	}

	getMisSolPeds(idSegUsuario: number): Promise<SolpedModelo[]> {
		return this.http.get<SolpedModelo[]>(this.URL_misSolpeds + "/" + idSegUsuario).toPromise();
	}


	getDetallesPorSolPed(idSolped: number): Observable<SolpedDetalleModelo[]> {
		//router.get("/api/solped/:idSolped/detalles", solpedDetalleOne);
		return this.http.get<SolpedDetalleModelo[]>(this.URL_nodeTodos + "/" + idSolped + '/detalles');
	}


	getMisSolPedsPresindencia(): Promise<SolpedModelo[]> {
		return this.http.get<SolpedModelo[]>(this.URL_presidencia).toPromise();
	}

	getArbolMasterDetail() {
		return this.http.get<TreeNode[]>(this.URL_api_arbol).toPromise();
	}


	getDetalleSolPed(idSolpedCompras: number): Promise<SolpedModelo> {
		return this.http.get<SolpedModelo>(this.URL_api + "/" + idSolpedCompras).toPromise();
	}

	getDetalleSolPedOne(idSolpedCompras: number): Promise<SolpedModelo> {
		return this.http.get<SolpedModelo>(this.URL_nodeTodos + "/" + idSolpedCompras).toPromise();
	}

	getDetalleSolPedTicket(idticket: number): Promise<SolpedModelo> {
		return this.http.get<SolpedModelo>(this.URL_api_solticket + "/" + idticket).toPromise();
	}

	nuevoSolPed(SolPed: SolpedModelo) {
		return this.http.post(this.URL_api, SolPed);
	}

	updateSolped(id: number, solped: SolpedModelo) {
		console.log(this.URL_nodeTodos + "/"); 
		return this.http.put(this.URL_nodeTodos + "/" + id, solped); 
	}

	cambiarFase(solped: SolpedModelo) {
		console.log("Cambio fase, ", solped);
		return this.http.put(this.URL_cambiofase, solped).toPromise();
	}

	updateFechaAprobacionSolped(solped: SolpedModelo) {
		return this.http.put(this.URL_upFechaAprpSolpded, solped);
	}

	setEmpresaAFacturar(solped: SolpedModelo) {	// console.log("A facturar, ", solped);
		return this.http.put(this.URL_afacturar, solped);
	}

	updateMontoTotal(solped: SolpedModelo) {
		//router.put("/api/update-monto", updateMontoTotal);
		return this.http.put(environment.solpedURL + 'update-monto', solped);
	}

	actualizarSolPed(SolPed: SolpedModelo) {
		/*   return this.http.put<SolpedModelo>(this.URL_api + "/" + SolPed.idSolpedCompras, SolPed).pipe(
			tap(result => {
			  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
			  this.srvlog.logearTransaccion("SolPed actualizado", currentUser);
			}),
			catchError(this.handleError('setSolPed', []))
		  ); */
		// console.log("Consultado:", SolPed);
		return this.http.put(this.URL_nodeTodos + "/" + SolPed.idSolpedCompras, SolPed).toPromise();
	}

	asignarSolped(SolPed: SolpedModelo) {
		return this.http.put(this.URL_asiganarSolped + "/" + SolPed.idSolpedCompras, SolPed).toPromise();
	}

	eliminarSolPed(SolPed: SolpedModelo) {

		return this.http.delete(this.URL_api + "/" + SolPed.idSolpedCompras).pipe(
			tap(result => {
				console.log('SolPed Eliminado');
				const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
				this.srvlog.logearTransaccion("SolPed Eliminado", currentUser);
			}),
			catchError(this.handleError('setSolPed', []))
		);
	}

	eliminarDetalles(idSolped: number) {
		return this.http.delete(this.URL_delDetallesTodas + "/" + idSolped);
	}

	//---------------Manejo de Errores
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}

}
