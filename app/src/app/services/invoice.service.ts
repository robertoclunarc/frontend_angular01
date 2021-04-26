import { InvoiceDetail } from './../models/invoice-detail';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from "rxjs";

import { Configuration } from '../app.configuration';
import { Invoice } from "../models/index";

@Injectable({
	providedIn: 'root'
})
export class InvoiceService {

	private url: string;

	constructor(private http: HttpClient) {

		this.url = Configuration.urlFacturacion;
	}

	getInvoices(database: string): Observable<Invoice[]> {

		const url = `${this.url}`;

		let params = new HttpParams().set('database', database);
		return this.http.get<Invoice[]>(this.url, { params: params })
			.pipe(
				tap(result => this.log(`fetched Invoices`)),
				catchError(this.handleError('getInvoices', []))
			);
	}

	getInvoicesById(database: string, id: number): Observable<Invoice[]> {
		const url = `${this.url}/${id}`;
		let params = new HttpParams().set('database', database);
		return this.http.get<Invoice[]>(url, { params: params })
			.pipe(
				tap(result => this.log(`fetched Invoices`)),
				catchError(this.handleError('getInvoices', []))
			);
	}

	updateDolarData(database: string, invoice: Invoice) {
		//let params = new HttpParams().set('database', database);
		//(invoice as any).database = database;
		invoice["database"] = database;
		const url = `${this.url}`;
		//console.log("Recibiendo...", invoice);

		return this.http.put<Invoice>(url, invoice);
	}

	updateDetailsInvoice(detail: InvoiceDetail, database: string) {

		detail["database"] = database;
		const url = `${this.url}/detalles`;
		//console.log("Recibiendo...", invoice);

		return this.http.put<Invoice>(url, detail);
	}

	getInvoicesByDate(database: string, since: string, until: string): Observable<Invoice[]> {
		const url = `${this.url}/${since}/${until}`;
		let params = new HttpParams().set('database', database);
		return this.http.get<Invoice[]>(url, { params: params })
			.pipe(
				tap(result => this.log(`fetched Invoices`)),
				catchError(this.handleError('getInvoices', []))
			);
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}

	private log(message: string) {
		console.log('InvoiceService: ' + message);
	}
}
