import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TicketServicio } from "../../models/ticket-servicio";
import { TrazaTicketServicio } from "../../models/traza-ticket-servicio"
import { TsTicketServicioService } from "../../services/ts-ticket-servicio.service";
import { TsTrazaTrazaService } from "../../services/ts-traza-ticket.service";
import { ImgsTicketServicioModelo } from "../../models/imgs-ticket-servicio";
import { ParametrosService } from "../../services/parametros.service";
import { SolPedDetalleService } from "../../services/sol-ped-detalle.service";
import { TsEstadosTicketService } from "../../services/ts-estados-ticket.service";
import { GerenciasService } from "../../services/gerencias.service";
import { SelectItem } from 'primeng/api';
import { RespuestaModelo } from 'src/app/models/respuesta-modelo';
import { RespuestaService } from 'src/app/services/respuesta.service';





@Component({
	selector: 'app-tickets-historico-recibidos',
	templateUrl: './tickets-historico-recibidos.component.html',
	styleUrls: ['./tickets-historico-recibidos.component.scss']
})
export class TicketsHistoricoRecibidosComponent implements OnInit {


	ticketsHistoricos: TicketServicio[] = [];
	ticketsOriginal: TicketServicio[] = [];

	trazaTicketHistorico: TrazaTicketServicio[] = [];

	ticketDetalle: TicketServicio = {};
	displayTrazas: boolean = false;

	archivosTicket: ImgsTicketServicioModelo[] = [];
	detallesSolicitud: any[] = [];

	idGerencia: number = -1;
	idUSuario: number = -1;
	cols: any;
	cols_trazas: any;

	listado_filtro: SelectItem[] = [];
	listado_filtro_gerencias: SelectItem[] = [];

	rangeDates: Date[];
	maxDate: Date;
	es: any;

	dirServidor: string = "";

	respuestas: RespuestaModelo[] = [];
	cols_preguntas: { field: string; header: string; width: string; }[];

	constructor(private svrTicket: TsTicketServicioService,/*  private srvTrazaTicket: TsTrazaTrazaService, */
		private svrParametros: ParametrosService, private svrSolpedDetalle: SolPedDetalleService,
		private svrEstadosTckets: TsEstadosTicketService, private svrGerencias: GerenciasService,
		private svrRespuestas: RespuestaService) {

		this.maxDate = new Date(Date.now());

		this.es = {
			firstDayOfWeek: 1,
			dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "sábado"],
			dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
			dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
			monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
			today: 'Hoy',
			clear: 'Borrar'
		}

	}

	ngOnInit() {

		this.idUSuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
		this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;

		this.cols = [
			{ field: 'idTicketServicio', header: 'Ticket', witdh: "10%" },
			{ field: 'fechaAlta', header: 'Fecha registro', witdh: "10%" },

			{ field: 'gerenciaOrigen', header: 'Gerencia Origen', witdh: "10%" },
			{ field: 'estadoActual', header: 'Estado', witdh: "10%" },
			{ field: 'nombre_asignado', header: 'Asignado', witdh: "10%" },
			{ field: 'descripcion', header: 'Descripción de Ticket', witdh: "50%" }

		];

		this.cols_trazas = [

			{ field: 'fechaAlta', header: 'Fecha registro', width: "20%" },
			// { field: 'fechaRequerida', header: 'Fecha Requerida' },
			{ field: 'nombreEstado', header: 'Estado', width: "10%" },
			{ field: 'Usuario', header: 'Usuario', width: "10%" },
			{ field: 'justificacion', header: 'Justificación', width: "50%" }
			// { field: 'descripcion', header: 'Descripción' },
		];

		this.cols_preguntas = [
			{ field: 'desc_pregunta', header: 'Item', width: "80%" },
		];


		this.listado_filtro.push({ label: "Todos", value: null });
		this.svrEstadosTckets.getEstadosFiltrosHisRecibidos()
			.then(data => {
				data.forEach(estado => {
					this.listado_filtro.push({ label: estado.nombre, value: estado.nombre });
				});
			});

		this.listado_filtro_gerencias.push({ label: "Todos", value: null });
		this.svrGerencias.getGerenciasFiltros()
			.then(data => {
				data.forEach(gerencia => {
					this.listado_filtro_gerencias.push({ label: gerencia.nombre, value: gerencia.nombre });
				});
			});

		this.svrParametros.getParametros2().then(data => {
			this.dirServidor = data[0].dirServidor;
			//console.log(data[0].dirServidor);
		});

		this.cargarLista();

		// this.rangeDates = [];

	}


	cargarLista() {
		this.svrTicket.getRecibidiosHistorico(this.idGerencia).then(data => {
			data.forEach(objeto => {
				objeto.idTicketServicio = parseInt(objeto.idTicketServicio);
			});
			this.ticketsHistoricos = data;
			this.ticketsOriginal = data;
			//console.table(data);
		});
	}

	filtrarPorEstado(event) {
		this.ticketsHistoricos = this.ticketsOriginal;

		if (event.value != null) {
			this.ticketsHistoricos = this.ticketsHistoricos.filter(ticket => {
				return ticket.estadoActual == event.value;
			});
		}
	}

	filtrarPorGerencia(event) {
		this.ticketsHistoricos = this.ticketsOriginal;

		if (event.value != null) {
			this.ticketsHistoricos = this.ticketsHistoricos.filter(ticket => {
				return ticket.gerenciaOrigen == event.value;
			});
		}
	}

	filtrarPorFecha(event) {

		if (this.rangeDates[0] && this.rangeDates[1]) {
			// console.log(this.rangeDates);
			this.filtrarPorRango(event);
		}
	}

	filtrarPorRango(event) {
		this.ticketsHistoricos = this.ticketsOriginal;
		this.ticketsHistoricos = this.ticketsHistoricos.filter(ticket => {
			return (new Date(formatDate(ticket.fechaAlta, 'yyyy-MM-dd', 'en'))).getTime() >= new Date(formatDate(this.rangeDates[0].toString(), 'yyyy-MM-dd', 'en')).getTime() 
				&& (new Date(formatDate(ticket.fechaAlta, 'yyyy-MM-dd', 'en'))).getTime() <= new Date(formatDate(this.rangeDates[1].toString(), 'yyyy-MM-dd', 'en')).getTime();
			// return (new Date()).getTime() > new Date(ultimoComentario.fechaAlta).getTime() + (24 * 60 * 60 * 1000);
		});
		// }
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

	dataToExport() {
		let historicos = [];
		this.ticketsHistoricos.forEach(ticket => {
			ticket.idTicketServicio = ticket.idTicketServicio.toString();
			historicos.push({
				idTicket: ticket.idTicketServicio,
				fechaRegistro: ticket.fechaAlta,
				gerenciaOrigen: ticket.gerenciaOrigen,
				estado: ticket.estadoActual,
				descripcion: ticket.descripcion
			});
		});
		return historicos;
	}

	exportExcel() {
		import("xlsx").then(xlsx => {
			const worksheet = xlsx.utils.json_to_sheet(this.dataToExport());
			const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
			const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
			this.saveAsExcelFile(excelBuffer, "primengTable");
		});
	}

	verTraza(ticket: TicketServicio) {
		this.ticketDetalle = ticket;
		this.svrTicket.getTrazasTicket(ticket.idTicketServicio).subscribe(
			data => {
				this.trazaTicketHistorico = data;
				this.displayTrazas = true;
			});
		this.svrTicket.getImgsTicket(ticket.idTicketServicio).subscribe(data2 => {
			this.archivosTicket = data2;
		});
		this.svrSolpedDetalle.getDetalleSolPedPorTS(ticket.idTicketServicio).then(dataDet => {
			this.detallesSolicitud = dataDet;
		});

		this.svrRespuestas.getTodasServicio(ticket.idTicketServicio).then((result) => {
			this.respuestas = result;
			//console.log("rspuestas : ", this.respuestas);
		});
	}

	cerrarDialogo() {
		this.displayTrazas = false;
	}

}
