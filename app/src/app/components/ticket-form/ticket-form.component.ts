import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

import { GerenciasModelo } from "../../models/gerencias";
import { ServiciosGerenciasModelo } from "../../models/servicios-gerencias";
import { TicketServicio } from "../../models/ticket-servicio";
import { TrazaTicketServicio } from "../../models/traza-ticket-servicio";
import { ImgsTicketServicioModelo } from "../../models/imgs-ticket-servicio";
import { SolpedDetalleModelo } from "../../models/solped-detalle";
import { SolpedModelo } from "../../models/solped";
import { Producto } from "../../models/producto";
import { Activo } from '../../models/activo';

import { TsTicketServicioService } from "../../services/ts-ticket-servicio.service";
import { GerenciasService } from "../../services/gerencias.service";
import { TsTrazaTrazaService } from "../../services/ts-traza-ticket.service";
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { ServiciosGerenciasService } from 'src/app/services/servicios-gerencias.service';
import { CargosService } from "../../services/cargos.service";
import { TsEstadosTicketService } from "../../services/ts-estados-ticket.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { UserService } from 'src/app/services/user.service';
import { ProductosService } from "../../services/productos.service";
import { AreaNegocioService } from "../../services/area-negocio.service";
import { ParametrosService } from "../../services/parametros.service";
import { SolPedService } from "../../services/sol-ped.service";
import { SolPedDetalleService } from "../../services/sol-ped-detalle.service";
import { AdmActivosService } from "../../services/config-generales/adm-activos.service";



import { environment } from 'src/environments/environment';
import { FileUpload } from 'primeng/fileupload';
import { EmpresaCompras } from 'src/app/models/empresa-compras';
import { AreaNegocioModelo } from "../../models/area-negocio";
import { EmpresacomprasService } from 'src/app/services/empresacompras.service';
import { CentroCostosService } from 'src/app/services/centro-costos.service';
import { CentroCostosModelo } from 'src/app/models/centro-costos';
import { TrazasSolped } from 'src/app/models/trazas-solped';
import { TrazaSolpedService } from 'src/app/services/traza-solped.service';
import { AreaTrabajo } from 'src/app/models';
import { RelacionAreasGerenciasService } from 'src/app/services/relacion-areas-gerencias.service';

@Component({
    selector: 'app-ticket-form',
    templateUrl: './ticket-form.component.html',
    styleUrls: ['./ticket-form.component.css'],
    providers: [TsTicketServicioService, GerenciasService, ServiciosGerenciasService, MessageService, TsEstadosTicketService, ConfirmationService]
})

export class TicketFormComponent implements OnInit {

    //currentUser: User;
    gereniciasDestino: GerenciasModelo[] = [];
    empresas: EmpresaCompras[] = [];
    serviciosGerencias: ServiciosGerenciasModelo[] = [];
    centrosCostos: CentroCostosModelo[] = [];
    DetallesSolPed: SolpedDetalleModelo[] = [];
    areasdeNegocios: AreaNegocioModelo[] = [];
    areasdeTrabajo: AreaTrabajo[] = [];
    areaTrabajoSelected: AreaTrabajo = {};
    DetalleSolPed: SolpedDetalleModelo = {};
    productos: Producto[] = [];
    producto: Producto = {};
    activos: Activo[] = [];
    activosI: SelectItem[] = [];
    activo: Activo = {};

    serviciosItems: SelectItem[] = [];
    empresasItems: SelectItem[] = []
    ccItems: SelectItem[] = []
    gerenciasItems: SelectItem[] = [];
    areasItems: SelectItem[] = [];

    usersVerificar: number[] = [];

    cols: any[];
    primera_fila = 0;
    areaDeNegocio: number = -1;

    uploadedFiles: any[] = [];
    _idticketGuadado: number = 0;

    ticket: TicketServicio = {};
    trazaTicket: TrazaTicketServicio = {};
    idUsuario: number;
    idGerencia: number;
    codigo: string;
    boton: string = "";
    dirServidor: string = "";

    imagenesTicket: ImgsTicketServicioModelo[] = [];

    mensaje: string = "";
    dia: Date = new Date();
    dia2: Date = new Date();
    es: any;

    ticketGenerado: number = -1;
    hayImagenes: boolean = false;
    desahabilitarImgs: boolean = true;
    displayDetSol: boolean = false;
    displayDetSol2: boolean = false;

    MAX_CARACTERES_NAME_ARCHI: number = 120;

    API_subir_archivo: string = environment.apiUrl + "subirimagenesticket/-1";

    constructor(private svrTicket: TsTicketServicioService, private svrGerencias: GerenciasService,
        private srvTrazaTicket: TsTrazaTrazaService, private svrServiciosGerencias: ServiciosGerenciasService, private svrCargos: CargosService,
        private svrEstadosTickets: TsEstadosTicketService, private messageService: MessageService,
        private confirmationService: ConfirmationService, private svrNotificaciones: NotificacionesService,
        private svrUsuarios: UserService, private svrProductos: ProductosService, private svrEmpresa: EmpresacomprasService,
        private svrCC: CentroCostosService, private svrAreaNegocio: AreaNegocioService,
        private svrParametros: ParametrosService, private svrSolped: SolPedService, private svrSolpedDetalle: SolPedDetalleService
        , private svrActivos: AdmActivosService, private svrTrazaSolped: TrazaSolpedService, private svrAreasTrabajo: RelacionAreasGerenciasService) {
        //this.idUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
    }

    ngOnInit() {
        this.mensaje = "";
        this.idUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
        this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;

        //this.svrGerencias.getTodos().subscribe(
        this.svrGerencias.getTodosSinActual(JSON.parse(sessionStorage.getItem('currentUser')).idGerencia).subscribe(
            data => {
                this.gereniciasDestino = data;
                this.gereniciasDestino.forEach(geren => {
                    this.gerenciasItems.push(
                        { label: geren.descripcion, value: geren.idConfigGerencia }
                    );
                });
                this.svrUsuarios.getUserConRolVerficarEnGerencia(JSON.parse(sessionStorage.getItem('currentUser')).idGerencia).subscribe(
                    data2 => {
                        for (let index = 0; index < Object.keys(data2).length; index++) {
                            //console.log(data2[index]["idSegUsuario"]);
                            this.usersVerificar.push(data2[index]["idSegUsuario"]);

                        }
                    });

            });

        this.serviciosItems.push({ label: "Seleccione la gerencia", value: "-1" })

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

        this.cols = [
            { field: 'codigo', header: 'Codigo' },
            { field: 'descripcion', header: 'Desc.' },
            { field: 'cantidad', header: 'Cant.' },
            { field: 'fechaRequerida', header: 'Fecha Req.' },
            { field: 'nombre_empresa', header: 'Empresa' }
        ];


        this.svrParametros.getParametros2().then(data => {
            this.dirServidor = data[0].dirServidor;
            //console.log(data[0].dirServidor);
        });

    }

    change_gerencia(event) {
        this.serviciosItems = [];
        this.svrServiciosGerencias.getServiciosUnaGerencia(event.value).subscribe(data => {
            this.serviciosGerencias = data;
            this.serviciosItems = [];
            this.serviciosItems.push({ label: "Seleccione un servicio", value: "-1" })
            this.serviciosGerencias.forEach(serv => {
                this.serviciosItems.push(
                    { label: serv.descripcion, value: serv.idServiciosGerencias }
                )
            })

        });

        /*       this.areasdeNegocios = [];
              this.areasItems = [];
              this.DetallesSolPed = [];
              this.areaDeNegocio = -1;
              //Comentar para que no salga en produccion
      
              this.svrAreaNegocio.getTodosPorGerencias(JSON.parse(sessionStorage.getItem('currentUser')).idGerencia).then(
                  data => {
                      this.areasdeNegocios = data;
                      //console.table(this.areasdeNegocios);
                      this.areasItems = [];
                      this.areasItems.push({ label: "Seleccione una Area de Negocio", value: "-1" })
                      this.areasdeNegocios.forEach(area => {
                          this.areasItems.push({ label: area.descripcion, value: area.idGenAreaNegocio });
                      })
                  }
              ); */

        this.activos = [];
        this.activosI = [];
        this.svrActivos.getPorGerencias(JSON.parse(sessionStorage.getItem('currentUser')).idGerencia).toPromise().then(data => {
            //this.activos = data;
            for (const activo of data) {
                this.activosI.push({
                    label: activo.nombre,
                    value: activo
                })
            }
        });

    }

    change_empresa(event) {
        this.ccItems = [];

        this.DetalleSolPed.nombre_empresa = this.empresasItems.find((empre) => empre.value = event.value).label;

        this.svrCC.getTodosPorEmpresaGerencia(event.value, JSON.parse(sessionStorage.getItem('currentUser')).idGerencia).then(data => {
            this.centrosCostos = data;
            this.ccItems = [];
            //this.ccItems.push({ label: "Seleccione un Centro de Costos", value: "-1" })
            this.centrosCostos.forEach(ccostos => {
                this.ccItems.push(
                    { label: ccostos.descripcion, value: ccostos.idGenCentroCostos }
                )
            })
            return true;
        }).then(resp => {

        });
    }

    nuevoDetSol() {
        
        this.boton = "Guardar";
        this.producto = {};
        // this.activo = {};
        //this.displayDetSol = true;
        this.areasdeTrabajo = [];
        this.areaTrabajoSelected = {};
        this.displayDetSol2 = true;
        this.DetalleSolPed = {};
        //this.ccItems.push({ label: "Seleccione un Centro de Costos", value: "-1" });
        this.empresas = [];
        this.empresasItems = [];
        this.dia2 = new Date();
        // this.empresasItems.push({ label: "Seleccione una empresa", value: null })
        /*  this.svrEmpresa.getTodosPorGerencia(JSON.parse(sessionStorage.getItem('currentUser')).idGerencia, this.areaDeNegocio).then(data => {
             this.empresas = data;
 
             this.empresas.forEach(empresa => {
                 this.empresasItems.push(
                     { label: empresa.nombre_empresa, value: empresa.IdComprasEmpresa }
                 )
             })
         }); */


    }

    cerrarDialogo() {
        this.displayDetSol2 = false;
        this.producto = {};
        //this.activo = {};
        this.DetalleSolPed = {};
    }

    buscarDatosActivo(e) {
        this.svrActivos.consultarPorId(e.query).subscribe(data => {
            //console.table(data);
            this.activos = data;
        });
    }

    async buscarDatosProductosCod(e) {
        this.productos = await this.svrProductos.consultarProdsporAmbito(this.idGerencia, this.activo.idAdmActivo, "codigo", e.query);
    }

    buscarDatosProductosNombre(e) {
        /* this.svrProductos.consultarPorCampoFrase('{"campo1":"nombre"}', e.query).subscribe(data => {
            this.productos = data;
        }); */
        this.svrProductos.consultarProdsporAmbito(this.idGerencia, this.activo.idAdmActivo, "nombre", e.query)
            .then((data) => {
                this.productos = data;
            });
    }

    buscarDatosProductosDesc(e) {
        /* this.svrProductos.consultarPorCampoFrase('{"campo1":"uso"}', e.query).subscribe(data => {
            this.productos = data;
        }); */
        this.svrProductos.consultarProdsporAmbito(this.idGerencia, this.activo.idAdmActivo, "uso", e.query)
            .then((data) => {
                this.productos = data;
            });
    }

    async seleccionadoCodigo() {
        this.DetalleSolPed.codigo = this.producto.codigo;
        this.DetalleSolPed.nombre = this.producto.nombre;
        this.DetalleSolPed.descripcion = this.producto.uso;
        this.DetalleSolPed.unidadMedidaC = this.producto.nombreUnidadMedida;
        // this.areasdeTrabajo = await this.svrAreasTrabajo.areasPorGerenciasProducto(this.idGerencia, this.producto.codigo);

        //console.log(this.producto.codigo);
        //console.table(this.productos.filter(prod => prod.codigo ==  this.DetalleSolPed.codigo)[0]);
    }

    seleccionadoActivo() {
        this.DetalleSolPed.nroActivo = this.activo.serial;
    }

    verDetalle(detalle: SolpedDetalleModelo) {
        // console.log(detalle);
        // console.log(detalle.fechaRequerida);
        this.boton = "Actualizar";
        this.producto = {};
        this.producto.codigo = detalle.codigo;
        this.producto.uso = detalle.descripcion;
        this.producto.nombre = detalle.nombre;
        // this.producto.idAdmUnidadMedida = detalle.unidadMedidaC;
        this.dia2 = null;
        this.dia2 = new Date(formatDate(detalle.fechaRequerida, "yyyy-MM-dd hh:mm:ss", "en-US"));
        //console.log(this.dia2);
        this.DetalleSolPed = detalle;
        this.areaTrabajoSelected.idAreaTrabajo = detalle.idAreaTrabajo;

        //cargo: Number(`${this.Usuario.idConfigCargo}`);
        this.displayDetSol2 = true;
    }


    async guardarDetalleSolped() {

        if (!this.DetalleSolPed.codigo) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar un codigo de producto' });
            return false;
        }

        if (!this.DetalleSolPed.nombre) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar una descripcion de producto' });
            return false;
        }

        if (!this.DetalleSolPed.cantidad) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar una cantidad' });
            return false;
        }

        /* if (!this.DetalleSolPed.justificacion) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar una justificacion' });
            return false;
        }
 */
        this.DetalleSolPed.fechaRequerida = formatDate(this.dia, "yyyy-MM-dd 00:00:00", "en-US");
        //
        this.DetalleSolPed.nroActivo = this.activo.idAdmActivo || -1;
        this.DetalleSolPed.idAreaTrabajo = this.areaTrabajoSelected.idAreaTrabajo || -1;
        this.DetalleSolPed.idGenAreaNegocio = this.areaTrabajoSelected.idGenAreaNegocio || -1;
        this.DetalleSolPed.IdComprasEmpresa = this.activo.idComprasEmpresa || -1;
        //console.log("activo", this.areaTrabajoSelected);
        this.DetalleSolPed.idGenCentroCostos = -1;
        // this.DetalleSolPed.nombre_empresa = (await this.svrEmpresa.getDetalleEmpresaComprasP(this.activo.idComprasEmpresa))[0].nombre_empresa;
        if (this.boton == "Guardar") {
            this.DetallesSolPed.push(this.DetalleSolPed);
        }
        this.displayDetSol2 = false;
    }

    borrarDetSol(detalle: SolpedDetalleModelo, indice) {
        this.DetallesSolPed.splice(indice, 1);
    }

    antesCargarArhivos(event) {
        this.imagenesTicket = [];
        //console.log("los de files: " + event.files.length);

        for (let file of event.files) {
            this.imagenesTicket.push({
                nombre_imagen: file.name,
                //direccion: environment.dirImgsSubidas + "imgstickets/" + file.name,
                direccion: this.dirServidor + file.name,
                idTicketServicio: null,
                img: ((file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/png") ? 1 : 0)
            });

        }
        //console.log("guardad: " + this._idticketGuadado);
        if (this._idticketGuadado != 0) {
            if (this.imagenesTicket.length > 0) {
                this.imagenesTicket.forEach(imagen => {
                    imagen.idTicketServicio = this._idticketGuadado;
                    //this.svrTicket.insertarImagen(imagen).subscribe();
                    this.svrTicket.insertarImagenP(imagen).then(() => { });
                    //console.log("entro en imagenes");  //comeatdo
                });
            }
        }


    }

    async cuandoSelecciona(event, archis: FileUpload) {

        for (let file of event.files) {
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

            let myRegex = /[',#%/Ññ$]/;
            if (myRegex.test(file.name + '')) {
                //console.log(file.name.indexOf("#"));
                this.messageService.clear();
                this.messageService.add({
                    key: 'tc2', severity: 'error', summary: `Caracteres: .',#%/ NO PERMITIDOS en el nombre de los archivos`,
                    life: 5000
                });
                archis.files.splice(archis.files.length - 1, 1);
                return false;
            }
            if ((file.name.length > this.MAX_CARACTERES_NAME_ARCHI)) {
                this.messageService.clear();
                this.messageService.add({
                    key: 'tc2', severity: 'error', summary: 'Nombre del archivo Excede los 120 caracteres',
                    life: 5000
                });
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


    async ejecutarGuardar(archis?: FileUpload) {

        if (archis.files.length > 0) { console.log("arcchivo: " + archis.files); archis.upload(); }
        //archis.upload();
        //return false;
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        let dataEstado = await this.svrEstadosTickets.getEstadoUnOrdenP(1);
        let dataCargo = await this.svrCargos.getDetallecargoP(currentUser.idConfigCargo);

        this.ticket.idSegUsuario = currentUser.idSegUsuario;
        this.ticket.justificacionEstadoActual = this.ticket.descripcion;
        this.ticket.idSegUsuarioOrigen = currentUser.idSegUsuario;
        this.ticket.idEstadoActual = dataEstado[0].idEstadoTicket;
        this.ticket.estadoActual = dataEstado[0].nombre;
        this.ticket.fechaEstadoActual = formatDate(new Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US");
        this.ticket.fechaRequerida = formatDate(this.dia.toString(), "yyyy-MM-dd HH:mm:ss", "en-US");
        this.ticket.idGerenciaOrigen = dataCargo[0].idConfigGerencia;

        let dataT = await this.svrTicket.nuevoTicketP(this.ticket).catch(resp => { console.log("Error e el ticket: ", resp) });


        //Armando la traza del ticket
        var traza: TrazaTicketServicio = {};

        traza.idTicketServicio = dataT["ObjectId"];
        this.ticketGenerado = dataT["ObjectId"];
        traza.justificacion = this.ticket.descripcion;
        traza.idEstadoTicket = this.ticket.idEstadoActual;
        traza.idSegUsuario = currentUser.idSegUsuario;
        traza.estadoAnterior = this.ticket.estadoActual;

        let datatraza = await this.srvTrazaTicket.nuevoTrazaP(traza);


        if (this.imagenesTicket.length > 0) {
            this._idticketGuadado = 0;
            this.imagenesTicket.forEach(async imagen => {
                imagen.idTicketServicio = dataT["ObjectId"];
                await this.svrTicket.insertarImagenP(imagen);
            });

            this.imagenesTicket = [];
        }


        if (this.DetallesSolPed.length > 0) {
            let nSolPed: SolpedModelo = {};
            nSolPed.idTicketServicio = dataT["ObjectId"];
            nSolPed.idEstadoActual = dataEstado[0].idEstadoTicket;
            nSolPed.estadoActual = dataEstado[0].nombre;
            nSolPed.descripcion = this.ticket.descripcion;
            nSolPed.idSolpedPadre = -1;
            nSolPed.idConfigGerencia = this.idGerencia;
            nSolPed.idAdmActivo = this.activo.idAdmActivo;
            nSolPed.idUsuarioRegistro = this.idUsuario;
            nSolPed.justificacion = this.ticket.descripcion;
            nSolPed.fechaRequerida = this.ticket.fechaRequerida;
            let dataSolped = await this.svrSolped.nuevoSolPed(nSolPed).toPromise();
            this.svrTicket.updateTicketSolped(dataT["ObjectId"], { idSolpedCompras: dataSolped["ObjectId"] }).subscribe((result) => console.log(result));

            this.DetallesSolPed.forEach(async det => {
                det.idSolpedCompras = dataSolped["ObjectId"];
                det.justificacion = nSolPed.justificacion;
                //console.log("Det nueva: ", det);
                await this.svrSolpedDetalle.nuevoDetSolped(det).toPromise();
            });

            let trazaSolped: TrazasSolped = {}
            trazaSolped.idSolpedCompras = dataSolped["ObjectId"];
            trazaSolped.idSegUsuario = currentUser.idSegUsuario;
            trazaSolped.justificacion = this.ticket.descripcion;
            trazaSolped.estadoAnterior = this.ticket.estadoActual;
            trazaSolped.idEstadoSolped = 1;
            trazaSolped.estadoActual = "EN TICKET";
            await this.svrTrazaSolped.guardarTraza(trazaSolped);
        }

        this.svrNotificaciones.nuevaNotificacion("Nuevo ticket: " + dataT["ObjectId"], this.ticket.idServiciosGerencias, 19,
            currentUser.idSegUsuario).subscribe((resp) => { console.log(resp) });


        this.messageService.clear();
        this.messageService.add({
            key: 'tc', severity: 'success', life: 5000, summary: "Ingreso del ticket satisfactorio",
            detail: "El nro de ticket es: " + dataT["ObjectId"] + ". Tengalo en cuenta para el seguimiento"
        });
        this.hayImagenes = false;
        this.desahabilitarImgs = true;
        this.ticket = {};
        this.activos = [];
        this.activo = {};
        this.DetallesSolPed = [];
        //archis.clear();
    }

    enviarMensajePantalla(key, mensaje, tipo = "success", detalle = "") {
        this.messageService.clear();
        this.messageService.add({
            key: key, severity: tipo, life: 5000, summary: mensaje, detail: detalle
        });
    }
    guardarTicket(archis: FileUpload) {

        //console.table(this.ticket.idGerenciaDestino);
        //return false;
        //console.log(archis);
        //return false;
        if (this.ticket.descripcion == null) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar una descripción' });
            return false;
        }
        if (this.ticket.idGerenciaDestino == null) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar una gerencia' });
            return false;
        }
        if (this.ticket.idServiciosGerencias == null) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar un servicio a solicitar' });
            return false;
        }

        //TODO: COMENTAR PARA PRODUCCION
        if (this.ticket.idGerenciaDestino == 4) {
            if (JSON.stringify(this.activo) === '{}') {
                this.messageService.clear();
                this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar el proposito' });
                return false;
            }
            if (this.DetallesSolPed.length <= 0) {
                this.messageService.clear();
                this.messageService.add({ key: 'tc2', severity: 'error', summary: 'Debe ingresar el detalle de los productos' });
                return false;
            }
        }

        this.confirmationService.confirm({
            message: "¿Desea crear un nuevo ticket de servicio?",
            accept: () => {

                this.ejecutarGuardar(archis);

            }
        });

    }


}
