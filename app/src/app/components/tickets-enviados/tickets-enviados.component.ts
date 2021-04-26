
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

import { TicketServicio } from "../../models/ticket-servicio";
import { TrazaTicketServicio } from "../../models/traza-ticket-servicio";
import { RolesAsignados } from "../../models/roles-asignados";
import { ImgsTicketServicioModelo } from "../../models/imgs-ticket-servicio";
import { SolpedDetalleModelo } from "../../models/solped-detalle";
import { EstadoTicket } from "../../models/estado-ticket";


import { TsTicketServicioService } from "../../services/ts-ticket-servicio.service";
import { TsTrazaTrazaService } from "../../services/ts-traza-ticket.service";
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { TsEstadosTicketService } from "../../services/ts-estados-ticket.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { SolPedService } from "../../services/sol-ped.service";
import { SolPedDetalleService } from "../../services/sol-ped-detalle.service";
import { ParametrosService } from "../../services/parametros.service";
import { PreguntaModelo } from 'src/app/models/pregunta-modelo';
import { RespuestaModelo } from 'src/app/models/respuesta-modelo';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { RespuestaService } from 'src/app/services/respuesta.service'; 


@Component({
    selector: 'app-tickets-enviados',
    templateUrl: './tickets-enviados.component.html',
    styleUrls: ['./tickets-enviados.component.css'],
    providers: [MessageService, ConfirmationService]
})
export class TicketsEnviadosComponent implements OnInit {

    cols: any = [];
    cols_trazas: any = [];
    cols_preguntas: any = [];

    Tickets: TicketServicio[] = [];
    TrazasTicket: TrazaTicketServicio[] = [];
    estadosItems: SelectItem[] = [];
    nuevaTraza: TrazaTicketServicio;
    estados: EstadoTicket[] = [];
    rolesUsrSesion: RolesAsignados[] = [];
    detallesSolPed: SolpedDetalleModelo[] = [];
    verBotonVerificar = 0;

    ticketDetalle: TicketServicio = {};

    ticketModificando: TicketServicio = {};

    archivosTicket: ImgsTicketServicioModelo[] = [];
    nombreEstadoNuevo: string = "";
    dirServidor: string = "";

    estaRegistrada: boolean = false;
    displayTrazas: boolean = false;
    displayCambiarEstado: boolean = false;
    displaySolped: boolean = false;
    habilitadoJust: boolean = true;
    habilitadoGuardar: boolean = true;


    idUsuario: number = -1;
    idGerencia: number = -1;
    rolAnular = "ROL-ATS";
    rolVerificar = "ROL-VTS";


    preguntas: PreguntaModelo[] = [];
    respuesta: RespuestaModelo = {};
    displayEncuesta: boolean;

    val : number = 1;

    //let anular = (this.rolesUsrSesion.find(rol => rol.codigoRol == this.rolAnular) ? 1 : 0);

    constructor(private svrTicket: TsTicketServicioService, private srvTrazaTicket: TsTrazaTrazaService,
        private svrEstadosTickets: TsEstadosTicketService, private messageService: MessageService,
        private confirmationService: ConfirmationService, private svrNotificaciones: NotificacionesService,
        private svrParametros: ParametrosService, private svrSolped: SolPedService, private svrSolpedDetalle: SolPedDetalleService,
        private svrPreguntas: PreguntaService, private svrRespuestas: RespuestaService

    ) {

        //console.log( (JSON.parse(localStorage.getItem('roles')).find((rol: { codigoRol: string; }) => rol.codigoRol == "ROL-VTS")));
        //console.table(JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == "ROL-VTS"));
        //console.log("resultado: " + this.idUsuario);
    }

    ngOnInit() {

        this.idUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
        this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
        this.rolesUsrSesion = JSON.parse(localStorage.getItem('roles'));
        this.verBotonVerificar = (JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.rolVerificar) != null ? 1 : 0);
        this.cols = [
            { field: 'idTicketServicio', header: 'Ticket', width: "5%" },
            { field: 'fechaAlta', header: 'Fecha registro', width: "10%" },
            // { field: 'fechaRequerida', header: 'Fecha Requerida' },
            { field: 'gerenciaDestino', header: 'Destino', width: "10%" },
            { field: 'estadoActual', header: 'Estado', width: "10%" },
            { field: 'descripcion', header: 'Descripción de Ticket', width: "40%" }
            // { field: 'descripcion', header: 'Descripción' },
        ];

        this.cols_trazas = [
            { field: 'fechaAlta', header: 'Fecha registro', width: "20%" },
            // { field: 'fechaRequerida', header: 'Fecha Requerida' },
            { field: 'nombreEstado', header: 'Estado', width: "10%" },
            { field: 'Usuario', header: 'Usuario', width: "10%" },
            { field: 'justificacion', header: 'Descripción de Ticket', width: "50%" }
            // { field: 'descripcion', header: 'Descripción' },
        ];

        this.cols_preguntas = [
            { field: 'descripcion', header: 'Items' }
        ];


        this.cargarLista();
        this.svrParametros.getParametros2().then(data => {
            this.dirServidor = data[0].dirServidor;
            //console.log(data[0].dirServidor);s
        });

    }

    cargarLista() {
        this.svrTicket.getEnviados(this.idGerencia).subscribe(data => {
            this.Tickets = data;
            //console.table(this.Tickets);
        });
    }


    cargarPreguntas(idGerenciaDestino) {

        this.svrPreguntas.getPreguntasGerencia(idGerenciaDestino).then((data) => {
            this.preguntas = data.map(preg => { let clone = {...preg}; clone.valoracion = "1"; return clone});            
            //this.respuestas = [...data];
            //console.log("respuestas", this.preguntas);
        });
    }

    verTraza(ticket: TicketServicio) {

        this.ticketDetalle = ticket;
        this.svrTicket.getTrazasTicket(ticket.idTicketServicio).subscribe(
            data => {
                this.TrazasTicket = data;
                this.displayTrazas = true;
                this.svrTicket.getImgsTicket2(ticket.idTicketServicio).then(data2 => {
                    this.archivosTicket = data2;
                });
            });
    }

    verDetalleSompled(ticket: TicketServicio) {
        this.svrSolpedDetalle.getDetalleSolPedPorTS(ticket.idTicketServicio).then(
            dataD => {
                this.detallesSolPed = dataD;
                // this.displayTrazas = false;
                this.displaySolped = true;
            }
        );

    }

    cambiarEstado(ticket: TicketServicio) {
        this.ticketModificando = null;
        this.ticketModificando = { ...ticket };
        this.displayCambiarEstado = true;
        //Uno para que añada el estado "Anulada"
        this.nuevaTraza = {};


        if (this.ticketModificando.idEstadoActual > 4) {
            this.displayEncuesta = true;
            this.cargarPreguntas(this.ticketModificando.idGerenciaDestino);
        }

        this.svrEstadosTickets.getEstadosRecibidos(ticket.idTicketServicio, this.verBotonVerificar).subscribe(
            data => {
                this.nuevaTraza.idTicketServicio = ticket.idTicketServicio;
                this.estados = data;
                this.estadosItems = null;
                this.estadosItems = [];
                this.estados.forEach(dato => {
                    this.estadosItems.push(
                        { label: dato.nombre, value: dato.idEstadoTicket }
                    );
                });
                //estadoTicket: Object(`{${ticket.idEstadoActual}, name: 'Registrada'}`);
            }
        );

    }

    cerrarDialogo() {
        this.nuevaTraza = null;
        this.displayCambiarEstado = false;
        this.displayTrazas = false;
        this.habilitadoGuardar = true;
        this.habilitadoJust = true;

        //this.ticketModificando = null;
    }

    cerrarDialogoSolped() {

        this.displaySolped = false;
        this.detallesSolPed = [];

        //this.ticketModificando = null;
    }

    change_estado(e) {
        //console.table(e); 

        //console.log("nombre sel " + e.value.name );
        this.nombreEstadoNuevo = this.estados.find(estado => estado.idEstadoTicket == e.value).nombre;
        this.nuevaTraza.idEstadoTicket = e.value;
        this.habilitadoGuardar = false;
        this.habilitadoJust = false;
    }

    async guardarNueva() {
        let clonar_noconforme: boolean = false;
        //console.log("Valor con preguntas: ", this.preguntas);
        //return false;
        if (this.nuevaTraza.idEstadoTicket == 9) {
            this.confirmationService.confirm({
                message: "Esta cambiando el ticket a NO-CONFORME. Si realiza esta acción se generará un nuevo ticket en estado Registrado. ¿Esta seguro?",
                accept: () => {
                    clonar_noconforme = true;
                    this.guardarComplejo(clonar_noconforme);
                    return
                },
                reject: () => {
                    return
                }
            });
        } else {

            if (this.nuevaTraza.justificacion == null || this.nuevaTraza.justificacion == " " || this.nuevaTraza.justificacion == "") {
                this.messageService.clear();
                this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar una justificación' });
                return false;
            }

            let no_respondidas = await Promise.all(this.preguntas.filter((pre) => { return pre.valoracion == null || pre.valoracion == 0 }));
            console.log("espero: ", no_respondidas);

            if (this.preguntas.length > 0 &&
                (this.nuevaTraza.idEstadoTicket == 6 || this.nuevaTraza.idEstadoTicket == 9) && (no_respondidas.length != 0)) {
                this.messageService.clear();
                this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe completar toda la encuesta' });
                return false;
            }

            // return false;

            this.nuevaTraza.estadoAnterior = this.ticketModificando.estadoActual;
            this.ticketModificando.idEstadoActual = this.nuevaTraza.idEstadoTicket;
            this.ticketModificando.estadoActual = this.nombreEstadoNuevo;
            this.ticketModificando.justificacionEstadoActual = this.nuevaTraza.justificacion;
            this.nuevaTraza.idSegUsuario = this.idUsuario;
            this.ticketModificando.fechaEstadoActual = formatDate(new Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US");


            //
            this.srvTrazaTicket.nuevoTraza(this.nuevaTraza).subscribe(data => {
                // console.table(this.nuevaTraza);
                this.svrTicket.actualizarTicket(this.ticketModificando).subscribe(data => {
                    // this.svrNotificaciones.nuevaNotificacionRecibe("Cambio de estado del ticket: " + this.ticketModificando.idTicketServicio, this.ticketModificando.idSegUsuario,
                    //  this.ticketModificando.idSegUsuario, this.ticketModificando.idServiciosGerencias).subscribe();
                    this.preguntas.forEach((pregunta) => {
                        let newResp: RespuestaModelo = {};
                        newResp.idPregunta = pregunta.idPregunta;
                        newResp.idRefServicio = this.ticketModificando.idTicketServicio;
                        newResp.idSegUsuario = this.idUsuario;
                        newResp.valoracion = pregunta.valoracion;
                        this.svrRespuestas.guardarRespuesta(newResp).then(() => { });
                    });
                    this.svrNotificaciones.nuevaNotificacion("Cambio de estado del ticket: " + this.ticketModificando.idTicketServicio,
                        this.ticketModificando.idServiciosGerencias, 0, this.ticketModificando.idSegUsuarioOrigen).subscribe();

                    this.cargarLista();
                    //});
                });
            });

            this.cerrarDialogo();
        }

    }

    copytable(e, el) {
        var urlField = document.getElementById("dtSolped");

        var range = document.createRange();
        range.selectNode(urlField);
        window.getSelection().addRange(range);
        document.execCommand('copy');
    }
    /* copy(text: any) {
         this._clipboardService.copyFromContent(text)
     }
 
 
     toHTML(input): any {
         return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
     }*/

    guardarComplejo(clonar: boolean) {
        this.nuevaTraza.estadoAnterior = this.ticketModificando.estadoActual;
        this.ticketModificando.idEstadoActual = this.nuevaTraza.idEstadoTicket
        this.ticketModificando.estadoActual = this.nombreEstadoNuevo;
        this.ticketModificando.justificacionEstadoActual = this.nuevaTraza.justificacion;
        this.nuevaTraza.idSegUsuario = this.idUsuario;
        this.ticketModificando.fechaEstadoActual = formatDate(new Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US");

        //
        this.srvTrazaTicket.nuevoTraza(this.nuevaTraza).subscribe(data => {
            // console.table(this.nuevaTraza);
            this.svrTicket.actualizarTicket(this.ticketModificando).subscribe(data => {
                this.svrNotificaciones.nuevaNotificacionRecibe("Cambio de estado del ticket: " + this.ticketModificando.idTicketServicio, this.ticketModificando.idSegUsuarioOrigen,
                    this.ticketModificando.idSegUsuario, this.ticketModificando.idServiciosGerencias).subscribe();

                //Clonar u  ticket por NO CONFORMIDAD
                if (clonar == true) {
                    //console.log("Entrosssss");
                    let ticketClonado: TicketServicio = { ... this.ticketModificando };

                    ticketClonado.justificacionEstadoActual = " NUEVO TICKET POR NO CONFORMIDAD NRO: " + this.ticketModificando.idTicketServicio;
                    ticketClonado.idTicketServicio = null;
                    ticketClonado.idEstadoActual = 1;
                    ticketClonado.estadoActual = "Registrado";
                    ticketClonado.descripcion = ticketClonado.descripcion + ticketClonado.justificacionEstadoActual;

                    this.svrTicket.nuevoTicket(ticketClonado).subscribe(data2 => {
                        var traza: TrazaTicketServicio = {};
                        traza.idTicketServicio = data2["ObjectId"];
                        traza.justificacion = ticketClonado.justificacionEstadoActual;
                        traza.idEstadoTicket = ticketClonado.idEstadoActual;
                        traza.idSegUsuario = ticketClonado.idSegUsuario;
                        traza.estadoAnterior = 1;

                        this.preguntas.forEach((pregunta) => {
                            let newResp: RespuestaModelo = {};
                            newResp.idPregunta = pregunta.idPregunta;
                            newResp.idRefServicio = this.ticketModificando.idTicketServicio;
                            newResp.idSegUsuario = this.idUsuario;
                            newResp.valoracion = pregunta.valoracion;
                            this.svrRespuestas.guardarRespuesta(newResp).then(() => { });
                        });

                        this.svrNotificaciones.nuevaNotificacion("Nuevo Ticket: " + data2["ObjectId"], ticketClonado.idServiciosGerencias, 19,
                            JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario).subscribe(datos => {
                                this.srvTrazaTicket.nuevoTraza(traza).subscribe();
                                this.cargarLista();
                            });
                    });
                }

                //this.ticketModificando.idServiciosGerencias).subscribe( data2 => {
                this.cargarLista();
                //});
            });
        });

        this.cerrarDialogo();
    }

}
