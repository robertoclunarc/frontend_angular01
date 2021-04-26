import { Component, OnInit, Input, Output, EventEmitter, Host } from '@angular/core';
import { SolpedDetalleModelo } from "../../models/solped-detalle";
import { SolPedDetalleService } from 'src/app/services/sol-ped-detalle.service';


import { TsTicketServicioService } from 'src/app/services/ts-ticket-servicio.service';

import { Observable, from } from 'rxjs';


@Component({
	selector: 'app-detalle-solped',
	templateUrl: './detalle-solped.component.html',
	styleUrls: ['./detalle-solped.component.scss']
})



export class DetalleSolpedComponent implements OnInit {
	cols: any[] = [];

	Detalles: SolpedDetalleModelo[] = [];
	//detallesSolPed: SolpedDetalleModelo[] = [];
	exportData: SolpedDetalleModelo[] = [];

	@Input('idTicket') idTicket: number = 0;

	_idTicket = 0;

	constructor(private svrSolpedDetalle: SolPedDetalleService,
		private svrTcket: TsTicketServicioService /*, @Host() private _ticketComponet: TicketsRecibidosComponent*/) {

	}

	//@Output('SolicitudPed') SolPed = new EventEmitter<SolpedDetalleModelo[]>();


	ngOnInit() {
		this.cols = [
			{ field: 'codigo', header: 'Codigo' },
			{ field: 'descripcion', header: 'Desc.' },
			{ field: 'cantidad', header: 'Cant.' },
			{ field: 'fechaRequerida', header: 'Fecha Req.' },
			{ field: 'nombre_empresa', header: 'Empresa' }
		];
		//this.areaNegocio = 0;
		this.svrTcket.getidTicket$().subscribe(resp => {
			this.idTicket = Number(resp);

			this.cargarData(Number(resp));
		});

		//console.log("Recibido Ticket:", this.idTicket);
		/* this._ticketComponet.idTicket$.
		subscribe(resp => {
			this._idTicket = Number(resp);
			this.cargarData(Number(resp));
		}); */
		//this.cargarData(this._ticketComponet.idTickeSelectd);

	}

	cargarData(ticket) {
		//console.log("Recibido cargar:", this.idTicket);
		/* let obs: Observable<any> = from(this.svrSolpedDetalle.getDetalleSolPedPorTS(this.idTicket));
		console.log("test observables: ", obs);

		obs.subscribe(resp => console.log(resp)); */

		this.svrSolpedDetalle.getDetalleSolPedPorTS(this.idTicket).then(
			dataD => {
				this.Detalles = dataD;
				// this.displayTrazas = false;

			}
		);
	}

	copyToClipboard(item): void {
		let listener = (e: ClipboardEvent) => {
			e.clipboardData.setData('text/plain', (item));
			e.preventDefault();
		};

		document.addEventListener('copy', listener);
		document.execCommand('copy');
		document.removeEventListener('copy', listener);
	}

	copyData() {
		let tabla = document.querySelector("detalle2");
		console.log("data: ", tabla);
		//this.copyToClipboard(tabla.innerHTML);
	}

	setExportdata() {

		let temp = []
		this.Detalles.forEach((row: SolpedDetalleModelo) => {
			temp.push(
				{
					codigo: row.codigo,
					descripcion: row.descripcion,
					unidadMedidaC: row.unidadMedidaC,
					cantidad: row.cantidad,
					justificacion: row.justificacion,
					fechaRequerida: row.fechaRequerida,
					nombre_empresa: row.nombre_empresa,
					nombre_an: row.nombre_an,
					nombre_cc: row.nombre_cc
				}
			);


		});


		return temp;
	}

	exportExcel() {
		import("xlsx").then(xlsx => {
			const worksheet = xlsx.utils.json_to_sheet(this.setExportdata());
			const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
			const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
			this.saveAsExcelFile(excelBuffer, "primengTable");
		});
	}

	saveAsExcelFile(buffer: any, fileName: string): void {
		import("file-saver").then(FileSaver => {
			let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
			let EXCEL_EXTENSION = '.xlsx';
			const data: Blob = new Blob([buffer], {
				type: EXCEL_TYPE
			});
			FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
		});
	}

	nuevoDetSol() {
		//this.SolPed.emit(this.Detalles);
	}

}
