import { Injectable } from '@angular/core';
import { TrazasSolped } from "../models/trazas-solped";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class TrazaSolpedService {

	//compras_sol_ped_trazas.php

	private URL_API = environment.apiUrl + "solpedtraza";
	private URL_nodeAPI = environment.solpedURL + "trazassolped";

	//private globalTrazas : TrazasSolped[] = [];
	private behTrazas : BehaviorSubject<TrazasSolped[]> = new BehaviorSubject<TrazasSolped[]>([]);
	trazas$ = this.behTrazas.asObservable();

	constructor(private _http: HttpClient) { }

	getAll(): Promise<TrazasSolped[]> {
		return this._http.get<TrazasSolped[]>(this.URL_API).toPromise();
	}

	getAllSolped(idSolpedCompras): Promise<TrazasSolped[]> {
		return this._http.get<TrazasSolped[]>(this.URL_nodeAPI + "/" + idSolpedCompras).toPromise();
	}

	guardarTraza(traza : TrazasSolped){
		return this._http.post(this.URL_API, traza).toPromise();
	}

	insertTraza(traza : TrazasSolped){
		return this._http.post(this.URL_nodeAPI, traza).toPromise();
	}

	async notificarCambio(idSolpedCompras : number){
		const trazas : TrazasSolped[] = await this.getAllSolped(idSolpedCompras);
		//this.globalTrazas = trazas;
		this.behTrazas.next(trazas);
	}

	

}
