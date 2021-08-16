
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { formatDate } from '@angular/common';

import { TicketServicio } from "../../models/ticket-servicio";
import { TrazaTicketServicio } from "../../models/traza-ticket-servicio";
import { ImgsTicketServicioModelo } from "../../models/imgs-ticket-servicio";
import { ParametrosService } from "../../services/parametros.service";

import { EstadoTicket } from "../../models/estado-ticket";


import { TsTicketServicioService } from "../../services/ts-ticket-servicio.service";
import { TsTrazaTrazaService } from "../../services/ts-traza-ticket.service";
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { TsEstadosTicketService } from "../../services/ts-estados-ticket.service";
import { NotificacionesService } from "../../services/notificaciones.service";


import { environment } from 'src/environments/environment';
import { SolPedService } from "../../services/sol-ped.service";

import { FileUpload } from 'primeng/fileupload';
import { Observable, Subscription } from 'rxjs';
// import { SolpedDetalleModelo } from 'src/app/models/solped-detalle';
import { SolpedModelo } from 'src/app/models/solped';
import { TrazaSolpedService } from 'src/app/services/traza-solped.service';
import { TrazasSolped } from 'src/app/models/trazas-solped';
import { Configuration } from '../../app.configuration';



@Component({
    selector: 'app-tickets-recibidos',
    templateUrl: './tickets-recibidos.component.html',
    styleUrls: ['./tickets-recibidos.component.css'],
    providers: [MessageService, ConfirmationService]
})

export class TicketsRecibidosComponent implements OnInit, OnDestroy {

    cols: any = [];
    cols_trazas: any = [];

    Tickets: TicketServicio[] = [];
    TrazasTicket: TrazaTicketServicio[] = [];
    estadosItems: SelectItem[] = [];
    nuevaTraza: TrazaTicketServicio = {};
    estados: EstadoTicket[] = [];
    archivosTicket: ImgsTicketServicioModelo[] = [];
    idTickeSelectd: number = -1;

    archivosTicketAdicionales: ImgsTicketServicioModelo[] = [];

    ticketDetalle: TicketServicio = {};

    class = "card-body collapse hide";
    dirServidor: string = "";

    nombreEstadoNuevo: string = "";

    estaRegistrada: boolean = false;
    displayTrazas: boolean = false;
    displayCambiarEstado: boolean = false;
    habilitadoJust: boolean = true;
    habilitadoGuardar: boolean = true;
    displaySolped: boolean = false;

    idUSuario: number = -1;
    idGerencia: number = -1;
    rolEstados = "ROL-CETS";
    GERENCIA_COMPRAS = 4;
    MAX_ORDEN = 7;
    verBotonModificar: number;

    _idticketGuadado: number = 0;

    API_subir_archivo: string = environment.apiUrl + "subirimagenesticket/-1";
    MAX_CARACTERES_NAME_ARCHI: number = 150;

    acc_adicional: number = 0;

    es: any;
    dia: Date = new Date();
    intervalo: Subscription;

    /* idTicketE: BehaviorSubject<string> = new BehaviorSubject("");
    idTicket$ = this.idTicketE.asObservable(); */


    //@ViewChild('dialogoDet', { static: false }) dialogoDet;

    constructor(private svrTicket: TsTicketServicioService, private srvTrazaTicket: TsTrazaTrazaService,
        private svrEstadosTickets: TsEstadosTicketService, private messageService: MessageService,
        private confirmationService: ConfirmationService, private svrNotificaciones: NotificacionesService,
        private svrParametros: ParametrosService, private svrSolped: SolPedService, private srvTrazaSolped: TrazaSolpedService) {

        //console.log(JSON.parse(localStorage.getItem('roles')));
    }

    ngOnInit() {
        this.idUSuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
        this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
        this.verBotonModificar = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.rolEstados)) != null ? 1 : 0);

        this.cols = [
            { field: 'idTicketServicio', header: 'Ticket', witdh: "10%", display: "true" },
            { field: 'fechaAlta', header: 'Fecha registro', witdh: "12%", display: "true" },
            // { field: 'fechaRequerida', header: 'Fecha Requerida' },
            { field: 'estadoActual', header: 'Estado', witdh: "8%", display: "true" },
            { field: 'descripcion', header: 'Descripción de Ticket', witdh: "50%", display: "true" },
            { field: 'justificacionEstadoActual', witdh: "0%", display: "none" },
            // { field: 'descripcion', header: 'Descripción' },
        ];

        this.es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
            today: 'Hoy',
            clear: 'Borrar'
        }

        this.svrParametros.getParametros2().then(data => {
            this.dirServidor = data[0].dirServidor;
            //console.log(data[0].dirServidor);
        });

        this.cargarLista();

        this.intervalo = Observable.interval(30000).subscribe(() => {
            this.cargarLista();
        });
    }

    cargarLista() {
        /*this.svrTicket.getRecibidios(this.idGerencia).subscribe(data => {
            this.Tickets = data;
            //console.table(this.Tickets);
        });*/
        this.svrTicket.getRecibidios(this.idGerencia, this.idUSuario).then(data => {
            data.forEach(ticket => {
                ticket.idTicketServicio = parseInt(ticket.idTicketServicio);
                //this.usuarios.push(usuario);
            });
            this.Tickets = <TicketServicio[]>data;
        });

    }

    verTraza(ticket: TicketServicio) {
        this.cols_trazas = [

            { field: 'fechaAlta', header: 'Fecha registro', width: "20%" },
            // { field: 'fechaRequerida', header: 'Fecha Requerida' },
            { field: 'nombreEstado', header: 'Estado', width: "10%" },
            { field: 'Usuario', header: 'Usuario', width: "10%" },
            { field: 'justificacion', header: 'Justificación', width: "50%" }
            // { field: 'descripcion', header: 'Descripción' },
        ];
        this.archivosTicket = [];
        this.ticketDetalle = ticket;
        this.svrTicket.getTrazasTicket(ticket.idTicketServicio).subscribe(
            data => {
                this.TrazasTicket = data;

                if (ticket.idEstadoActual == 2) {
                    //Nuevo estado leido
                    let nueva: TrazaTicketServicio = {};
                    nueva.idSegUsuario = this.idUSuario;
                    nueva.estadoAnterior = this.ticketDetalle.estadoActual;
                    nueva.idEstadoTicket = 10;
                    nueva.idTicketServicio = this.ticketDetalle.idTicketServicio;
                    nueva.justificacion = "Generado Automaticamente por el sistema al leer el ticket";

                    this.ticketDetalle.idEstadoActual = 10; //Id del estado leido               
                    this.ticketDetalle.estadoActual = "Leido"

                    this.ticketDetalle.justificacionEstadoActual = "Generado Automaticamente por el sistema al leer el ticket";
                    this.ticketDetalle.fechaEstadoActual = formatDate(new Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US");
                    //console.table(nueva);

                    this.srvTrazaTicket.nuevoTraza(nueva).subscribe(data => {
                        this.svrTicket.actualizarTicket(this.ticketDetalle).subscribe(data => {
                        });
                    });
                    //---------------------- 
                }

                this.displayTrazas = true;
            });

        this.svrTicket.getImgsTicket(ticket.idTicketServicio).subscribe(data2 => {
            this.archivosTicket = data2;
        });
    }



    async cambiarEstado(ticket: TicketServicio) {
        this.acc_adicional = 0;
        this._idticketGuadado = ticket.idTicketServicio;
        this.nuevaTraza = {};

        if (ticket.idEstadoActual == 2) {
            //Estado leido
            let nueva: TrazaTicketServicio = {};
            nueva.idSegUsuario = this.idUSuario;
            nueva.estadoAnterior = ticket.estadoActual;
            nueva.idEstadoTicket = 10;
            nueva.idTicketServicio = ticket.idTicketServicio;
            nueva.justificacion = "Generado Automaticamente por el sistema al leer el ticket";

            ticket.idEstadoActual = 10; //Id del estado leido               
            ticket.estadoActual = "Leido";

            ticket.justificacionEstadoActual = "Generado Automaticamente por el sistema al leer el ticket";
            ticket.fechaEstadoActual = formatDate(new Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US");
            
            //debugger
            // let ordenActual = await this.svrEstadosTickets.getOrdenporEstado(ticket.idEstadoActual);
            // let orden = ordenActual[0].orden



            //console.table(nueva);

            this.srvTrazaTicket.nuevoTraza(nueva).subscribe(data => {

                this.svrTicket.actualizarTicket(ticket).subscribe(async data => {
                    this.ticketDetalle = null;
                    this.ticketDetalle = { ...ticket };
                    this.displayCambiarEstado = true;

                    // if (ticket.idGerenciaDestino == this.GERENCIA_COMPRAS && ticket.idEstadoActual < 5) {
                    //     let solpeds: SolpedModelo = await this.svrSolped.getDetalleSolPedTicket(ticket.idTicketServicio);
                    //     let solped = { ...solpeds[0] };
                    //     if (solpeds) {
                    //         solped.idEstadoActual = ticket.idEstadoActual;
                    //         solped.estadoActual = ticket.estadoActual.toUpperCase();
                    //         //console.log(solped);

                    //         let trazaSolped: TrazasSolped = {}
                    //         trazaSolped.idSolpedCompras = solped.idSolpedCompras;
                    //         trazaSolped.idSegUsuario = this.idUSuario;
                    //         trazaSolped.justificacion = ticket.justificacionEstadoActual;
                    //         trazaSolped.estadoAnterior = ticket.estadoActual;
                    //         trazaSolped.idEstadoSolped = (orden == 5 ? 2 : 1);
                    //         trazaSolped.estadoActual = (orden == 5 ? "APROBADO" : "EN TICKET");
                    //         this.srvTrazaSolped.guardarTraza(trazaSolped).then();
                    //     }
                    // }
                    //this.nuevaTraza = {};

                    let mostrarEstado = 0;
                    if ((ticket.idEstadoActual == 2) || (ticket.idEstadoActual == 3) || (ticket.idEstadoActual == 10)) {
                        mostrarEstado = 2;
                    } else if (ticket.idEstadoActual == 4) {
                        mostrarEstado = 3;
                    }


                    this.svrEstadosTickets.obtenerEstadoSiguiente(ticket.idTicketServicio, mostrarEstado).subscribe(
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
                            //estadoTicket: Number(`${this.ticketDetalle.idEstadoActual}`);
                        }
                    );


                });
            });

        } else {
            this.ticketDetalle = null;
            this.ticketDetalle = { ...ticket };
            this.displayCambiarEstado = true;

            //this.nuevaTraza = {};

            let mostrarEstado = 0;
            if ((ticket.idEstadoActual == 2) || (ticket.idEstadoActual == 3) || (ticket.idEstadoActual == 10)) {
                mostrarEstado = 2;
            } else if (ticket.idEstadoActual == 4) {
                mostrarEstado = 3;
            }
            this.svrEstadosTickets.obtenerEstadoSiguiente(ticket.idTicketServicio, mostrarEstado).subscribe(
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
                    //estadoTicket: Number(`${this.ticketDetalle.idEstadoActual}`);
                }
            );
        }
    }

    cerrarDialogo() {
        this.nuevaTraza = {};
        this.displayCambiarEstado = false;
        this.displayTrazas = false;
        this.habilitadoGuardar = true;
        this.habilitadoJust = true;
        this.cargarLista();
        this._idticketGuadado = 0;
    }

    cerrarDialogoSolped() {

        this.displaySolped = false;
        //this.detallesSolPed = [];

        //this.ticketModificando = null;
    }

    change_estado(e) {
        //console.table(e); 
        this.acc_adicional = 0;
        //console.log("nombre sel " + e.value.name );
        this.nombreEstadoNuevo = this.estados.find(estado => estado.idEstadoTicket == e.value).nombre;
        this.acc_adicional = this.estados.find(estado => estado.idEstadoTicket == e.value).accion_adicional
        //console.log(this.nombreEstadoNuevo);
        //this.nuevaTraza.idEstadoTicket = e.value;
        this.habilitadoGuardar = false;
        this.habilitadoJust = false;
    }

    verDetalleSompled(ticket: TicketServicio) {
        /*  this.svrSolpedDetalle.getDetalleSolPedPorTS(ticket.idTicketServicio).then(
             dataD => {
                 this.detallesSolPed = dataD;
                 // this.displayTrazas = false;
                 this.displaySolped = true;
             }
         ); */
        //this.idTicketE.next(ticket.idTicketServicio);
        //console.log(ticket);
        this.idTickeSelectd = ticket.idTicketServicio;
        this.svrTicket.setDataidTicketObs(ticket.idTicketServicio);
        this.displaySolped = true;

    }

    async cuandoSelecciona(event, archis: FileUpload) {

        for (let file of event.files) {
            //console.log("tipo" + file.type);
            let existeimg: ImgsTicketServicioModelo[] = [];
            existeimg = await this.svrTicket.imagenYaInsertada(file.name);

            if (existeimg.length > 0) {
                //console.log("entro: " + existeimg);
                archis.files.splice(archis.files.length - 1, 1);
                this.messageService.clear();
                this.messageService.add({
                    key: 'tc2', severity: 'error', summary: 'Nombre del archivo YA INGRESADO al sistema',
                    detail: 'Use nombres como: FACTNRO1234_19-11-2019.PNG',
                    life: 5000
                });

                return false;
            }

            if ((file.name.indexOf("#") != -1) || (file.name.indexOf("%") != -1) || (file.name.indexOf("/") != -1)) {
                //console.log(file.name.indexOf("#"));
                this.messageService.clear();
                this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Nombre del archivo con caracteres #, $, %, / NO PERMITIDOS' });
                archis.files.splice(archis.files.length - 1, 1);
                return false;
            }
            if ((file.name.length > this.MAX_CARACTERES_NAME_ARCHI)) {
                this.messageService.clear();
                this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Nombre del archivo Excede los 150 caracteres' });
                archis.files.splice(archis.files.length - 1, 1);
                return false;
            }

            switch (file.type) {
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":   //Excel xlsx                
                    break;
                case "application/vnd.ms-excel": //excel xls         
                    break;
                case "application/pdf": //PDF       
                    break;
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": //word docx 
                    break;
                case "application/msword": //word doc
                    break;
                case "image/jpeg": //imagen jpg
                    break;
                case "image/png": //imagen png
                    break;
                case "image/jpg": //imagen jpg
                    break;
                default:
                    archis.files.splice(archis.files.length - 1, 1);
                    break;
            }

        }
    }

    despuesCargarArhivos(event) {
        this.archivosTicketAdicionales = [];

        for (let file of event.files) {

            this.archivosTicketAdicionales.push({
                nombre_imagen: file.name,
                //direccion: environment.dirImgsSubidas + "imgstickets/" + file.name,
                direccion: this.dirServidor + file.name,
                idTicketServicio: null,
                img: ((file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/png") ? 1 : 0)
            });

        }

        this.archivosTicketAdicionales.forEach(imagen => {
            imagen.idTicketServicio = this._idticketGuadado;
            imagen.idTicketServicio = this.ticketDetalle.idTicketServicio;
            this.svrTicket.insertarImagen(imagen).subscribe();
            //console.log("entro en imagenes");  //comeatdo
        });

    }


    async guardarNueva(archis2?: FileUpload) {

        if (this.nuevaTraza.justificacion == null || this.nuevaTraza.justificacion == " " || this.nuevaTraza.justificacion == "") {
            this.messageService.clear();
            this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar una justificación' });
            return false;
        }

        //
        if (this.acc_adicional == 1 && archis2.files.length > 0) {
            archis2.upload();
            //console.log(archis2);
        }

        // console.table(this.archivosTicketAdicionales);
        //return false;
        //console.table(this.nuevaTraza);
        this.nuevaTraza.idSegUsuario = this.idUSuario;
        this.nuevaTraza.estadoAnterior = this.ticketDetalle.estadoActual;
        this.ticketDetalle.idEstadoActual = this.nuevaTraza.idEstadoTicket;

        //Para colocar la fecha estimada solo cuando ponen el ticket en recibida
        if (this.ticketDetalle.idEstadoActual == 3) {
            this.ticketDetalle.fechaEstimada = formatDate(this.dia, "yyyy-MM-dd", "en-US");
        }
        this.ticketDetalle.estadoActual = this.nombreEstadoNuevo;
        this.ticketDetalle.justificacionEstadoActual = this.nuevaTraza.justificacion;
        this.ticketDetalle.fechaEstadoActual = formatDate(new Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US");
        
        let ordenActual = await this.svrEstadosTickets.getOrdenporEstado(this.ticketDetalle.idEstadoActual);
        let orden = ordenActual[0].orden


        //return false;
        console.log("por aqui!!!1");

        this.srvTrazaTicket.nuevoTraza(this.nuevaTraza).subscribe(data => {
            this.svrTicket.actualizarTicket(this.ticketDetalle).subscribe(async data => {

                // if (+this.ticketDetalle.idGerenciaDestino === +this.GERENCIA_COMPRAS && +orden <= this.MAX_ORDEN) {
                // solo debe hacer esto si esta aprobando a mneos estado
                if (+this.ticketDetalle.idGerenciaDestino === +this.GERENCIA_COMPRAS && +this.ticketDetalle.idEstadoActual === 4) {
                    // let solpeds: SolpedModelo = await this.svrSolped.getDetalleSolPedTicket(this.ticketDetalle.idTicketServicio);
                    // let solped: SolpedModelo = await this.svrSolped.getDetalleSolPedTicket(this.ticketDetalle.idTicketServicio)[0];
                    // let solped : SolpedModelo = { ...solpeds[0] };
                    let solped : SolpedModelo = { ...(await this.svrSolped.getDetalleSolPedTicket(this.ticketDetalle.idTicketServicio))[0] };
                    console.log(solped);
                    if ( !Configuration.isEmpty(solped)  && +solped.idEstadoActual < 5) {
                        solped.idEstadoActual = this.ticketDetalle.idEstadoActual;
                        solped.estadoActual = this.ticketDetalle.estadoActual.toUpperCase();
                        await this.svrSolped.actualizarSolPed(solped);

                        let trazaSolped: TrazasSolped = {}
                        trazaSolped.idSolpedCompras = solped.idSolpedCompras;
                        trazaSolped.idSegUsuario = this.idUSuario;
                        trazaSolped.justificacion = this.ticketDetalle.justificacionEstadoActual;
                        trazaSolped.estadoAnterior = this.ticketDetalle.estadoActual;

                        trazaSolped.idEstadoSolped = (orden == 5 ? 2 : 1);
                        trazaSolped.estadoActual = (orden == 5 ? "APROBADO" : "EN TICKET");
                        await this.srvTrazaSolped.guardarTraza(trazaSolped);
                    }
                }
                this.svrNotificaciones.nuevaNotificacionRecibe("Cambio de estado del ticket: " + this.ticketDetalle.idTicketServicio,
                    this.idUSuario, this.ticketDetalle.idSegUsuario,
                    this.ticketDetalle.idServiciosGerencias).subscribe(
                        data => {
                            this.cargarLista();
                        });
            });
        });

        this.cerrarDialogo();

    }


    ngOnDestroy() {
        this.intervalo.unsubscribe();
    }
}
