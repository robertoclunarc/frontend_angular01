import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RelacionAreaGcia } from '../models/relacion-area-gcia';
import { AdmAreasTrabajo } from '../models/adm-areas-trabajo'
import { AreaNegocioModelo } from '../models/area-negocio'
//import { ConfigGerencias } from '../models/config-gerencias'
import { environment } from 'src/environments/environment';
import { GerenciasModelo } from '../models/gerencias';



@Injectable({
	providedIn: 'root'
})
export class RelacionAreasGerenciasService {

	url: string;
	url2: string;
	url3: string;
	constructor(private http: HttpClient) {

		this.url = environment.apiUrl + 'relacion_areas_gerencia';
		this.url2 = environment.apiUrl + 'areas_trabajo';
		this.url3 = environment.apiUrl + 'config_gerencias';
	}

	consultaRelaciones(): Promise<RelacionAreaGcia[]> {
		return this.http.get<RelacionAreaGcia[]>(this.url).toPromise();
	}

	consultarArea(): Promise<AdmAreasTrabajo[]> {
		return this.http.get<AdmAreasTrabajo[]>(this.url2).toPromise();
	}

	consultarGerencias(): Promise<GerenciasModelo[]> {
		return this.http.get<GerenciasModelo[]>(this.url3).toPromise();
	}

	nuevaATG(nueva: RelacionAreaGcia): Promise<RelacionAreaGcia> {
		return this.http.post<RelacionAreaGcia>(this.url, nueva).toPromise();
	}

	nuevaAT(nueva: AdmAreasTrabajo) {
		return this.http.post<AdmAreasTrabajo>(this.url2, nueva).toPromise();
	}

	actualizarAT(nueva: AdmAreasTrabajo) {
		return this.http.put<AdmAreasTrabajo>(this.url2 + `/${nueva.idAreaTrabajo}`, nueva).toPromise();
	}

	obtenerAreaNegocioPertenece(idAreaTrabajo: number): Promise<AreaNegocioModelo[]> {
		return this.http.get<AreaNegocioModelo[]>(`${this.url2}/${idAreaTrabajo}`).toPromise();
	}

	areasPorGerenciasProducto(idConfigGerencia: number, codigoProducto: number): Promise<AdmAreasTrabajo[]> {
		return this.http.get<AdmAreasTrabajo[]>(`${environment.apiUrl}areasporproducto/${idConfigGerencia}/${codigoProducto}`).toPromise();
	}

	GerenciasporArea(idAreaTrabajo: number): Promise<RelacionAreaGcia[]> {
		let url = `${this.url}/${idAreaTrabajo}`;
		return this.http.get<RelacionAreaGcia[]>(url).toPromise();
	}

	modificarRelacionATG(id: number) {
		let url = `${this.url}/${id}`;
		return this.http.put<RelacionAreaGcia>(url, id).toPromise();
	}

	eliminaRelacionATG(id: number): Promise<any> {
		let url = `${this.url}/${id}`;
		return this.http.delete<RelacionAreaGcia>(url).toPromise();
	}

	eliminarAT(id: number): Promise<any> {
		let url2 = `${this.url2}/${id}`;
		return this.http.delete<AdmAreasTrabajo>(url2).toPromise();
	}

}
