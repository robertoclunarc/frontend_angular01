import { detalleOcModelo } from './../models/oc-Detalle';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { OrdenCompra, EstadosOC, EstadosOc } from './../models/orden-compra';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class OrdenCompraService {

	constructor(private http: HttpClient) { }

	insertOC(oc: OrdenCompra) {
		return this.http.post(environment.solpedURL + 'oc', oc);
	}

	getAll(): Observable<OrdenCompra[]> {
		return this.http.get<OrdenCompra[]>(environment.solpedURL + 'oc');
	}

	getListado(): Observable<OrdenCompra[]> {
		return this.http.get<OrdenCompra[]>(environment.solpedURL + 'oc/activas/');
	}

	getListadoHis(): Observable<OrdenCompra[]> {
		// http://localhost:3005/api/oc/historico/oc
		return this.http.get<OrdenCompra[]>(environment.solpedURL + 'oc/historico/oc');
	}

	getEstadosOC(idEstadoActual: number): Observable<EstadosOc[]> {
		return this.http.get<EstadosOc[]>(environment.solpedURL + 'oc/estados/' + idEstadoActual);
	}

	//nuevo
	getEstadosOcActualySigui(idEstadoActual: number): Observable<EstadosOc[]> {
		return this.http.get<EstadosOc[]>(environment.solpedURL + 'oc/estados-actual-sig/' + idEstadoActual);
	}

	getOcOne(idoc : number) : Observable<OrdenCompra>{
		//console.log(environment.solpedURL + 'oc/' + idoc.toString());
		return this.http.get<OrdenCompra>(environment.solpedURL + 'oc/' + idoc.toString());
	}

	getDetallesPorOC(idOC: number): Observable<detalleOcModelo[]> {
		//console.log(environment.solpedURL + 'oc/' + idOC.toString() + '/detalles');
		return this.http.get<detalleOcModelo[]>(environment.solpedURL + 'oc/' + idOC.toString() + '/detalles');
	}

	async getDetallesPorOCpromise(idOC: number): Promise<detalleOcModelo[]> {
		//console.log(environment.solpedURL + 'oc/' + idOC.toString() + '/detalles');
		return await this.http.get<detalleOcModelo[]>(environment.solpedURL + 'oc/' + idOC.toString() + '/detalles').toPromise();
	}

	updateOc(id: number, oc: OrdenCompra){
		return this.http.put(environment.solpedURL + 'oc/' + id.toString(), oc);
	}

	updateMontoTotalOc(id: number, oc: OrdenCompra){
		return this.http.put(environment.solpedURL + `oc/update-monto/${id}`, oc);
	}

	updateCorrelativo(id: number, oc : OrdenCompra){
		// /api/oc/update-correlativo/:idComprasOC
		return this.http.put(environment.solpedURL + `oc/update-correlativo/${id}`, oc);

	}
}