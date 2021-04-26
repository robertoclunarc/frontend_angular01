//se establecen todos los servicios relacionados a:
//almacenes, piso, pasillo, estantes y puestos.

import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Almacen } from '../models/almacen';
import { Piso } from '../models/almacen';
import { Pasillo } from '../models/almacen';
import { Estante } from '../models/almacen';
import { Nivel } from '../models/almacen';
import { Puesto } from '../models/almacen';

import { environment } from 'src/environments/environment';


import { Almacenes } from '../models/almacenes';


@Injectable({
	providedIn: 'root'
})
export class AlmacenesService {

	url: string;
	url2: string;
	UrlPiso: string;
	UrlPasillo: string;
	UrlEstante: string;
	UrlNivel: string;
	UrlPuesto: string;
	UrlNode: string;

	UrlAdminAlmacenes: string


	data: any[];

	constructor(private http: HttpClient, private httpModule: HttpClientModule) {

		//this.UrlAdminAlmacenes = environment.AdminAlmacenesUrl + 'estructura';


		this.UrlPuesto = environment.AdminAlmacenesUrl + 'puesto';
		//this.UrlNode = environment.pyApiUrl + 'estructura';
		this.UrlNode = environment.AdminAlmacenesUrl + 'estructura';
		//this.UrlNodeGerencia = environment.AdminAlmacenesUrl + 'estructura';
		this.UrlAdminAlmacenes = environment.AdminAlmacenesUrl + 'almacenes';

	}


	////////////////////PUESTO//////////////////////////////////7

	getPuesto(): Promise<Puesto[]> {
		return this.http.get<Puesto[]>(this.UrlPuesto).toPromise();
	}

	nuevoPuesto(nuevo: Puesto) {
		return this.http.post<Puesto>(this.UrlPuesto, nuevo).toPromise();

	}

	updatePuesto(id, puesto: Puesto) {
		const UrlPuesto = `${this.UrlPuesto}/${id}`;
		return this.http.put<Puesto>(UrlPuesto, puesto).toPromise();
	}

	eliminarPuesto(id: number): Promise<any> {
		const UrlPuesto = `${this.UrlPuesto}/${id}`;
		return this.http.delete<Puesto>(UrlPuesto).toPromise();
	}

	////////////////PARA LLENAR TABLA PRIME NG///////

	nodeTree() {
		return this.http.get<any>(this.UrlNode).toPromise();
	}

	nodeTreeGerencia(id: number) {
		return this.http.get<any>(this.UrlNode + `/${id}`).toPromise();
	}

	/////////////////////////////////////NodeJS Environment
	nodeNuevoRegistro(nuevo: Almacenes) {
		return this.http.post<Almacenes>(this.UrlAdminAlmacenes, nuevo).toPromise();
	}

	nodeUpdateRegistro(id: number, updated: Almacenes) {
		//return updated;
		const url = `${this.UrlAdminAlmacenes}/${id}`;
		return this.http.put<Almacenes>(url, updated).toPromise();

	}

	nodeEliminarRegistro(id: number): Promise<any> {
		let Url = `${this.UrlAdminAlmacenes}/${id}`;
		return this.http.delete<Almacenes>(Url).toPromise();
	}

	TodosLosRegistros(): Promise<Almacenes[]> {
		return this.http.get<Almacenes[]>(this.UrlAdminAlmacenes).toPromise();
	}

	
	regsitrosPorGerencia(idGerencia: number): Promise<Almacenes[]> {
		return this.http.get<Almacenes[]>( `${this.UrlAdminAlmacenes}/${idGerencia}`).toPromise();
	}

	registrosPorNivel(id: number): Promise<Almacenes[]> {
		let Url = `${this.UrlAdminAlmacenes}/${id}`;
		return this.http.get<Almacenes[]>(Url).toPromise();
	}



}
