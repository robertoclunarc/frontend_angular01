import { Activo } from './../../models/activo';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Iadm_activos, Iconfig_activos_areas_negocios, Iconfig_activos_gerencias, IactivosJoin } from '../../models/config-generales/Iadm-activos';

@Injectable({
	providedIn: 'root'
})
export class AdmActivosService {
	private url: string;
	admActivo: Iadm_activos = { nombre: "", descripcion: "", serial: "" };
	activos: Iadm_activos[];
	activosJoins: IactivosJoin[];
	activoJoin: IactivosJoin;
	constructor(private http: HttpClient) {
		this.url = environment.admCatalogoUrl + 'activos';
	}


	consultarTodos(): Observable<Iadm_activos[]> {

		return this.http.get<Iadm_activos[]>(this.url + '/consultar')
			.pipe(
				tap(result => this.log(`fetched Activos`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}

	consultarJoin(): Observable<IactivosJoin[]> {
		return this.http.get<IactivosJoin[]>(this.url + '/consultarjoins')
			.pipe(
				tap(result => this.log(`fetched Activos Join`)),
				catchError(this.handleError('consultarJoin', []))
			);
	}

	consultarActivosGcia(idAdmAct: number): Observable<Iconfig_activos_gerencias[]> {
		const url = `${this.url}/activosporgerecias/${idAdmAct}`;
		return this.http.get<Iconfig_activos_gerencias[]>(url)
			.pipe(
				tap(result => { }),
				catchError(this.handleError('consultarActivosGcia', []))
			);
	}

	consultarActivosAreasNeg(idAdmAct: number): Observable<Iconfig_activos_areas_negocios[]> {
		const url = `${this.url}/activosporareas/${idAdmAct}`;
		return this.http.get<Iconfig_activos_areas_negocios[]>(url)
			.pipe(
				tap(result => this.log(`fetched Activos por Gcias`)),
				catchError(this.handleError('consultarActivosGcia', []))
			);
	}


	consultarPorId(_idAdmActivo: number): Observable<Iadm_activos[]> {
		const activo: Iadm_activos = {
			idAdmActivo: _idAdmActivo,
			nombre: null,
			descripcion: null,
			serial: null,
			idAdmProducto: null,
			idComprasEmpresa: null
		}

		return this.viewFromAnyField(activo);
	}

	viewFromAnyField(activo: Iadm_activos): Observable<Iadm_activos[]> {
		let _id: any;
		let _nombre = activo.nombre;
		let _desc = activo.descripcion;
		let _serial = activo.serial;
		let _idProducto: any;
		let _idComEmpresa: any

		if (activo.idAdmActivo == null) {
			_id = "NULL";
		} else {
			_id = activo.idAdmActivo.toString();
		}
		if (activo.nombre == null) {
			_nombre = "NULL";
		}
		if (activo.descripcion == null) {
			_desc = "NULL";
		}
		if (activo.serial == null) {
			_serial = "NULL";
		}
		if (activo.idAdmProducto == null) {
			_idProducto = "NULL";
		} else {
			_idProducto = activo.idAdmProducto.toString();
		}

		if (activo.idComprasEmpresa == null) {
			_idComEmpresa = "NULL";
		} else {
			_idComEmpresa = activo.idComprasEmpresa.toString();
		}

		const url = `${this.url}/filtar/${_id}/${_nombre}/${_desc}/${_serial}/${_idProducto}/${_idComEmpresa}`;

		return this.http.get<Iadm_activos[]>(url)
			.pipe(
				tap(result => this.log(`fetched Activo`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}

	// getPorGerencias(idGerencia: number): <Iadm_activos[]> {
	// 	//   return this.consultarTodos().toPromise();
	// 	//   return this.consultarTodos();

	// }


	getPorGerencias(idGerencia: number): Observable<Iadm_activos[]> {
		return this.consultarTodos();

	}

	getPorGerenciasOLD(idGerencia: number): Observable<Activo[]> {

		return this.http.get<Activo[]>(environment.apiUrl + `activos/gerencia/` + `${idGerencia}`);
		// return this.consultarTodos().toPromise();
		//Esto hacerlo solo cuando este listo
		// return this.http.post<Iadm_activos>(this.url + '/insertar', activo).pipe(
		//   tap(result => {this.admActivo=result; this.log(`Activo insertado`)}),
		//   catchError(this.handleError('registrar activo', []))
		// );
	}

	//


	registrar(activo: Iadm_activos) {
		return this.http.post<Iadm_activos>(this.url + '/insertar', activo).pipe(
			tap(result => { this.admActivo = result; this.log(`Activo insertado`) }),
			catchError(this.handleError('registrar activo', []))
		);
	}

	insertarareanegocio(areaNegocio: Iconfig_activos_areas_negocios) {
		return this.http.post(this.url + '/insertarareanegocio', areaNegocio).pipe(
			tap(result => {
			}),
			catchError(this.handleError('registrar relacion activo-area negocio', []))
		);

	}

	insertaractivogerencia(activoGcia: Iconfig_activos_gerencias) {
		return this.http.post(this.url + '/insertaractivogerencia', activoGcia).pipe(
			tap(result => {
			}),
			catchError(this.handleError('registrar relacion activo-gerencia', []))
		);

	}

	actualizar(activoActual: Iadm_activos) {
		const url = `${this.url}/actualizar/${activoActual.idAdmActivo}`;

		return this.http.put(url, activoActual).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando Activo', []))
		);
	}

	eliminarActivosGcias(idAdmActivo: number) {
		const url = `${this.url}/eliminargerencias/${idAdmActivo}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando gerencias', []))
		);
	}

	eliminarActivosAreaNegocio(idAdmActivo: number) {
		const url = `${this.url}/eliminarareasnegocio/${idAdmActivo}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando areas negocio', []))
		);
	}

	eliminar(idAdmActivo: number) {
		const url = `${this.url}/eliminar/${idAdmActivo}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando Activo', []))
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
