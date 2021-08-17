import { Component, OnInit } from '@angular/core';

import { TicketServicio } from "../../models/ticket-servicio";
import { TrazaTicketServicio } from "../../models/traza-ticket-servicio"
import { TsTicketServicioService } from "../../services/ts-ticket-servicio.service";
import { TsTrazaTrazaService } from "../../services/ts-traza-ticket.service";
import { ImgsTicketServicioModelo } from "../../models/imgs-ticket-servicio";
import { ParametrosService } from "../../services/parametros.service";
// import { SolpedDetalleModelo } from "../../models/solped-detalle";
import { SolPedDetalleService } from "../../services/sol-ped-detalle.service";
import { SelectItem } from 'primeng/api';
import { TsEstadosTicketService } from 'src/app/services/ts-estados-ticket.service';
import { GerenciasService } from 'src/app/services/gerencias.service';
import { formatDate } from '@angular/common';


@Component({
    selector: 'app-tickets-historico-enviados',
    templateUrl: './tickets-historico-enviados.component.html',
    styleUrls: ['./tickets-historico-enviados.component.scss'],
    providers: [TsTicketServicioService, TsTrazaTrazaService]
})


export class TicketsHistoricoEnviadosComponent implements OnInit {

    ticketsHistoricos: TicketServicio[] = [];
    trazaTicketHistorico: TrazaTicketServicio[] = [];
    ticketDetalle: TicketServicio = {};
    displayTrazas: boolean = false;
    archivosTicket: ImgsTicketServicioModelo[] = [];
    detallesSolicitud: any[] = [];

    dirServidor: string = "";

    idGerencia: number = -1;
    idUSuario: number = -1;
    cols: any;
    cols_trazas: any;


    ticketsOriginal: TicketServicio[] = [];
    listado_filtro: SelectItem[] = [];
    listado_filtro_gerencias: SelectItem[] = [];

    rangeDates: Date[];
    maxDate: Date;
    es: any;

    constructor(private svrTicket: TsTicketServicioService,
        private svrParametros: ParametrosService, private svrSolpedDetalle: SolPedDetalleService,
        private svrEstadosTckets: TsEstadosTicketService, private svrGerencias: GerenciasService
    ) {
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

            { field: 'gerenciaDestino', header: 'Gerencia Destino', witdh: "10%" },
            { field: 'estadoActual', header: 'Estado', witdh: "10%" },
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

        this.cargarLista();
        this.svrParametros.getParametros2().then(data => {
            this.dirServidor = data[0].dirServidor;
            //console.log(data[0].dirServidor);
        });
    }

    cargarLista() {
        this.svrTicket.getEnviadosHistorico(this.idGerencia).subscribe(data => {
            this.ticketsHistoricos = data;
            this.ticketsOriginal = data;
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
                return ticket.gerenciaDestino == event.value;
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

    verTraza(ticket: TicketServicio) {
        this.ticketDetalle = ticket;
        this.svrTicket.getTrazasTicket(ticket.idTicketServicio).subscribe(
            data => {
                this.trazaTicketHistorico = data;
                this.displayTrazas = true;
                this.svrTicket.getImgsTicket(ticket.idTicketServicio).subscribe(data2 => {
                    this.archivosTicket = data2;
                });
            });
        this.svrTicket.getImgsTicket(ticket.idTicketServicio).subscribe(data2 => {
            this.archivosTicket = data2;
        });
        this.svrSolpedDetalle.getDetalleSolPedPorTS(ticket.idTicketServicio).then(dataDet => {
            this.detallesSolicitud = dataDet;
        });
    }

    cerrarDialogo() {
        this.displayTrazas = false;
    }

}