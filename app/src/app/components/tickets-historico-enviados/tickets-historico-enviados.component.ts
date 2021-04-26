import { Component, OnInit } from '@angular/core';

import { TicketServicio } from "../../models/ticket-servicio";
import { TrazaTicketServicio } from "../../models/traza-ticket-servicio"
import { TsTicketServicioService } from "../../services/ts-ticket-servicio.service";
import { TsTrazaTrazaService } from "../../services/ts-traza-ticket.service";
import { ImgsTicketServicioModelo } from "../../models/imgs-ticket-servicio";
import { ParametrosService } from "../../services/parametros.service";
import { SolpedDetalleModelo } from "../../models/solped-detalle";
import { SolPedDetalleService } from "../../services/sol-ped-detalle.service";


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

    constructor(private svrTicket: TsTicketServicioService, private srvTrazaTicket: TsTrazaTrazaService,
        private svrParametros: ParametrosService, private svrSolpedDetalle: SolPedDetalleService) { }

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

        this.cargarLista();
        this.svrParametros.getParametros2().then(data => {
            this.dirServidor = data[0].dirServidor;
            //console.log(data[0].dirServidor);
        });
    }

    cargarLista() {
        this.svrTicket.getEnviadosHistorico(this.idGerencia).subscribe(data => {
            this.ticketsHistoricos = data;
            //console.table(data);

        });
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