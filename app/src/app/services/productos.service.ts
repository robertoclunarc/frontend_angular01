import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Producto, Busqueda, ComplementariaProducto, AplicabilidadProducto, ImgProducto } from '../models';
import { LogTransacService } from '../services/logtransac.service';

@Injectable({
	providedIn: 'root'
})
export class ProductosService {

	private url: string;
	private urlCompras: string;

	constructor(private http: HttpClient, private srvlog: LogTransacService) {
		this.url = environment.apiUrl + 'productos';
		this.urlCompras = environment.comprasUrl + 'productos';
	}

	consultarTodos(): Observable<Producto[]> {
		let apiURL = this.url;
		return this.http.get<Producto[]>(this.url);
	}

	async getAll(): Promise<Producto[]> {

		return await this.http.get<Producto[]>(this.urlCompras + '/consultar')
			.toPromise()
			/*.pipe(
				tap(result => this.log(`fetched Productos`)),
				catchError(this.handleError('getAll', []))
			);*/
	}


	consultarPorId(idAdmProducto: number): Observable<Producto[]> {

		let apiURL = `${this.url}/${idAdmProducto}`;
		return this.http.get<Producto[]>(apiURL);
	}

	consultarPorCampoFrase(pCampos: string, pFrase: string): Observable<Producto[]> {

		const url = `${this.url}/busqueda`;

		return this.http.post<Producto[]>(url, { campos: pCampos, frase: pFrase })
			.pipe(
				catchError(this.handleError('consultarPorCampoFrase', []))
			);
	}

	consultarProdsporAmbito(idConfigGerencia: number, idActivo: number, campo: string, valor: string): Promise<Producto[]> {
		return this.http.get<Producto[]>(`${environment.apiUrl}productossolped/${idConfigGerencia}/${idActivo}/${campo}/${valor}`).toPromise();
	}


	consultarDatosAdicionales(idAdmProducto: number): Observable<ComplementariaProducto[]> {
		let apiURL = `${this.url}/${idAdmProducto}/complementarias`;
		return this.http.post<ComplementariaProducto[]>(apiURL, { "aplicaComplementaria": 0 });
	}


	consultarComplementarias(idAdmProducto: number): Observable<ComplementariaProducto[]> {
		let apiURL = `${this.url}/${idAdmProducto}/complementarias`;
		return this.http.post<ComplementariaProducto[]>(apiURL, { "aplicaComplementaria": 1 });
	}

	consultarAplicabilidad(idAdmProducto: number): Observable<AplicabilidadProducto[]> {
		let apiURL = `${this.url}/${idAdmProducto}/aplicabilidad`;
		return this.http.get<AplicabilidadProducto[]>(apiURL);
	}

	busquedaPorCamposJSONFrase(pCamposJSON: any, pFrase: string): Observable<Producto[]> {

		let busqueda: Busqueda = {};

		busqueda.campos = pCamposJSON;
		busqueda.frase = pFrase;

		const url = `${this.url}/busqueda/json`;

		return this.http.post<Producto[]>(url, busqueda)
			.pipe(
				catchError(this.handleError('consultarPorCampoFrase', []))
			);
	}


	registrar(Producto: Producto) {
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("REGISTRO PRODUCTO " + Producto.codigo, currentUser, 1);
		return this.http.post(this.url, Producto).toPromise();
	}

	actualizar(productoActual: Producto, tipoaccion = -1): Promise<Producto> {
		const url = `${this.url}/${productoActual.idAdmProducto}`;
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("ACTUALIZACION PRODUCTO " + productoActual.codigo, currentUser, tipoaccion);
		return this.http.put(url, productoActual).toPromise();

	}

	actualizarP(productoActual: Producto, tipoaccion = -1): Observable<Producto> {
		const url = `${this.url}/${productoActual.idAdmProducto}`;
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("ACTUALIZACION PRODUCTO " + productoActual.codigo, currentUser, tipoaccion);
		return this.http.put(url, productoActual);
	}

	actualizarSoloDataAlamcen(productoActual: Producto, tipoaccion = -1){
		const url = `${this.url}/soloalmacen/${productoActual.idAdmProducto}`;
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("ACTUALIZACION PRODUCTO - ALMACEN " + productoActual.codigo, currentUser, tipoaccion);
		return this.http.put(url, productoActual);
	}


	actualizarAprobarAlamcen(productoActual: Producto, tipoaccion = -1){
		const url = `${this.url}/aprobarAlmacen/${productoActual.idAdmProducto}`;
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
		this.srvlog.logearTransaccion("ACTUALIZACION PRODUCTO - ALMACEN " + productoActual.codigo, currentUser, tipoaccion);
		return this.http.put(url, productoActual);
	}

	eliminar(idAdmProducto: number) {

		const url = `${this.url}/${idAdmProducto}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando Producto', []))
		);
	}

	imagenYaInsertada(nombre: string): Promise<ImgProducto[]> {
		return this.http.get<ImgProducto[]>(this.url + "/" + nombre).toPromise();
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
