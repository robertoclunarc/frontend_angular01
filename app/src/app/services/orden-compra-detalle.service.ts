import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { detalleOcModelo } from '../models/oc-Detalle';

@Injectable({
	providedIn: 'root'
})
export class OrdenCompraDetalleService {

	constructor(private http: HttpClient) { }

	insertDetOc(detoc: detalleOcModelo) {
		return this.http.post(environment.solpedURL + 'ocdetalle', detoc);
	}

	updateSegunTasa(id: number, detoc: detalleOcModelo) {
		return this.http.put(environment.solpedURL + `ocdetalle/update-por-tasa/${id}`, detoc);

	}

}
