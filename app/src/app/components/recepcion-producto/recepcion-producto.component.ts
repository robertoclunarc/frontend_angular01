import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { recepcionOC } from '../../models/recepcionOC'; //trae la data de la oc preexistente
import { requisicion } from '../../models/requisicion'; //genera la cabecera de la recepcion
import { Unidadmedidas } from '../../models/unidadmedidas'
import { EmpresaModelo } from '../../models/empresa';
import { MovimientoAlmacen } from "../../models/MovimientoAlmacen";
import { recepcion_detalle } from "../../models/recepcion_detalle"; //detalles de recepcion
import { RecepcionProductosService } from '../../services/recepcion-productos.service';
import { UnidadesMedidaService } from '../../services/unidades-medida.service';
import { EmpresacomprasService } from '../../services/empresacompras.service';
import { OrdenCompraService } from '../../services/orden-compra.service';
import { ConfirmationService, MessageService , SelectItem} from 'primeng/api';


import { detalleOcModelo } from 'src/app/models/oc-Detalle';

import { inventario_resumen } from 'src/app/models/inventario';


//import { TsTicketServicioService } from "../../services/ts-ticket-servicio.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { EmpresaCompras } from 'src/app/models/empresa-compras';

@Component({
	selector: 'app-recepcion-producto',
	templateUrl: './recepcion-producto.component.html',
	providers: [MessageService, RecepcionProductosService, ConfirmationService, OrdenCompraService],
	styleUrls: ['./recepcion-producto.component.scss']
})

export class RecepcionProductoComponent implements OnInit {

	nuevoMovimiento: MovimientoAlmacen = {};
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	detallesOc: recepcionOC[];
	clonedDetallesOc: { [s: string]: recepcionOC; } = {};
	UnaRecepcion: requisicion = {};
	nombreEmpresa: string;
	rifempresa: string;
	nuevaRecepcion: requisicion = {};
	nuevoDetalle: recepcion_detalle = {};
	empresaproveedor: string;
	rifProveedor: string;
	codigo: string;
	estatusProducto: string;
	setEstado: string;
	detallesOc2: recepcionOC[] = [];
	//ordenCompra: detalleOcModelo = {};
	inv_resm: inventario_resumen = {};

	isdisabled: boolean;
	readOnly: boolean;
	cargaInventario: boolean;

	recibido: number;
	conforme: number;
	encontrada: number;

	unidMedidas: Unidadmedidas[]=[];
	empresasCompra: EmpresaCompras[]=[];

	//ticket: TicketServicio = {};

	idUsuario: number;
	idGerencia: number;
	displayDialog: boolean;
	newMovimiento: boolean;
	tituloDialogo: string;
	idOC: number;

	constructor(private recepcionPservices: RecepcionProductosService,
		private messageService: MessageService,
		//private svrTicket: TsTicketServicioService,
		private actRouter: ActivatedRoute,
		private svrNotificaciones: NotificacionesService,
		private confirmationService: ConfirmationService,
		private OrdenCompraService: OrdenCompraService,
		private UnidadesMedidaService: UnidadesMedidaService,
		private empresasComprasService: EmpresacomprasService) { }

	ngOnInit() {
		this.idOC=this.actRouter.snapshot.params.idOc;
		this.unidadMedida();
		this.empresascompras ();
		this.ObtenerDetallesOc(this.idOC);
		//console.log(this.currentUser);
	}

	async ObtenerDetallesOc(codigo) {
		this.isdisabled = false;
		this.readOnly = false;
		this.codigo = codigo;
		
		//await this.recepcionPservices.ObtenerDetalleOc(this.codigo) //recithisbe la data de la orden de compra
		  await this.OrdenCompraService.getDetallesPorOC(codigo)
		  	.toPromise()
			.then(result => {
				this.detallesOc = result;
				if (this.detallesOc.length <= 0) {
					//console.log('envia mensaje')
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'info', summary: 'NO EXISTE LA ORDEN DE COMPRA, VERIFIQUE EL CODIGO' })

				} else {
					this.detallesOc.forEach(d => {
						d.unidadMedidaNombre = this.unidMedidas.find(u => u.idAdmUnidadMedida== d.unidadMedidaC).abrev;
						d.nombreEmpresa = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).nombre_empresa;
						d.rif = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).rif;
						
					});
					this.nombreEmpresa = this.empresasCompra.find(e => e.IdComprasEmpresa == this.detallesOc[0].IdComprasEmpresa).nombre_empresa;
					this.rifempresa = this.empresasCompra.find(e => e.IdComprasEmpresa == this.detallesOc[0].IdComprasEmpresa).rif;
					
					this.onSearch(result);

				}
			}
			);
	}

	async unidadMedida (){		
		await this.UnidadesMedidaService.consultarTodos()
			.toPromise()
			.then(result => {
				this.unidMedidas=result;
			})		
	}

	async empresascompras (){		
		await this.empresasComprasService.getTodos()			
			.then(result => {
				this.empresasCompra=result;
			})		
	}

	onSearch(detallesOc: recepcionOC[]) {

		this.detallesOc = detallesOc;

		this.UnaRecepcion = {};
		//console.log('resulta:', detallesOc);
		this.nombreEmpresa = this.detallesOc[0].nombreEmpresa;
		this.rifempresa = this.detallesOc[0].rif;
		this.empresaproveedor = this.detallesOc[0].nombreProveedor;
		this.rifProveedor = this.detallesOc[0].rifProveedor;

		let id = this.detallesOc[0].idComprasOC;

		this.recepcionPservices.FindRecepcion(id).then(
			result => {
				this.UnaRecepcion = result;


				//console.log('encontro una recepcion asociada', this.UnaRecepcion);
				if (!result || result == null) {
					this.generarRecepcion();
				} else if (this.UnaRecepcion.estado == "Anulado") {
					this.isdisabled = true;
				} else if (this.UnaRecepcion.estado == "Procesado") {
					this.isdisabled = true;
				}
			}
		);


	}

	onRowEditInit(rowData: recepcionOC) {

		this.clonedDetallesOc[rowData.codigo] = { ...rowData };
		this.readOnly = false;
		if (rowData.cant_encontrada == rowData.cant_recibido && rowData.cant_encontrada == rowData.cant_conforme && rowData.cant_encontrada!=0) {

			/* let desacttivar = document.getElementById(index + 'boton') as HTMLElement;
			desacttivar.hasAttribute(`disabled = "true"`);
			console.log(desacttivar); */
			this.readOnly = true;
		} else {
			this.readOnly = false;
		}
	}

	onRowEditSave(rowData: recepcionOC, index: number) {

		this.nuevoDetalle = {};
		this.encontrada = rowData.cant_encontrada;
		this.recibido = rowData.cant_recibido;
		this.conforme = rowData.cant_conforme;
		this.nuevoMovimiento = {};
		this.inv_resm = {};
		this.cargaInventario = false;
    //console.log('rowData', rowData)

    //console.log(this.clonedDetallesOc);
    /* if (!this.recibido || !this.conforme){

      this.messageService.clear();
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Ingrese los campos requeridos' })

    } */if (this.encontrada != this.conforme) {

			console.log(' generar notificacion');
			let dataT = {
				mensaje: "Faltan productos por entregar; Orden de Compra N°: " + `${this.codigo}`,
				idUsuario: JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario,
				idGerencia: JSON.parse(sessionStorage.getItem('currentUser')).idGerencia
			};

			this.generarNotificacion(dataT);


		} else if (this.recibido != this.conforme || this.encontrada != this.recibido) {
			//console.log('generar notificacion, setear estatus');
			this.setEstado = "no conforme"

			let dataT = {
				mensaje: "Los productos recibidos no coinciden con la factura; Orden de Compra: " + `${this.codigo}`,
				idUsuario: JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario,
				idGerencia: JSON.parse(sessionStorage.getItem('currentUser')).idGerencia
			};

			this.generarNotificacion(dataT);

		} else if (this.encontrada == this.recibido && this.encontrada == this.conforme) {

			this.estatusProducto = "conforme";
			//aqui se deberia genrar un ingreso de producto a almacen
			this.cargaInventario = true;
			//this.guardarDetalle(rowData);------------------------------------------------deshabilitado por rlunar
			console.log('aqui guardo detalle');
			//console.log('positvo para procesar carga inventario', this.cargaInventario);
		}

		let ordenCompra: detalleOcModelo = {
			idOcDetalle: rowData.idOcDetalle,
			notas: rowData.notas,
			cant_recibido: rowData.cant_recibido,
			cant_conforme: rowData.cant_conforme,
		};


		/*this.recepcionPservices.UpdateOCdetalle(ordenCompra).then(data => {
			//console.log('oc actualizada', data);

		})--------------------------------------------------------------------------------deshabilitado por rlunar*/

		//this.guardarDetalle(rowData);
		this.esMovimiento(rowData, index);

		/* 
		this.nuevoDetalle.idOrdenCompra = rowData.idComprasOC;
		this.nuevoDetalle.idRecepcionOC = this.UnaRecepcion.idRecepcionOC,
		this.nuevoDetalle.idOcDetalle = rowData.idComprasOC;
		this.nuevoDetalle.idProducto = rowData.idProducto;
		this.nuevoDetalle.codigoProducto = rowData.codigo;
		//this.nuevoDetalle.entrada= this.entrada;
		//this.nuevoDetalle.salida= this.salida;
		//this.nuevoDetalle.idAlmacenOrigen = ;
		//this.nuevoDetalle.idAlmacenDestino = ;
		this.nuevoDetalle.idUsuarioProceso = this.currentUser.idSegUsuario;
		//this.nuevoDetalle.idUsuarioAprobacion =;
		this.nuevoDetalle.costoBs = rowData.precio;
		  //costoDollar:,
		this.nuevoDetalle.cant_oc = rowData.cant_encontrada;
		this.nuevoDetalle.cant_recibida = rowData.cant_recibido;
		this.nuevoDetalle.cant_conforme =  rowData.cant_conforme;
		this.nuevoDetalle.observaciones = rowData.notas;
		this.nuevoDetalle.idActivo = rowData.idAdmActivo,
		//this.nuevoDetalle.AlmacenEsLogico = ?,
		this.nuevoDetalle.id_puesto = rowData.idPuesto;
		this.nuevoDetalle.codigoPuesto = rowData.codigoPuesto;
		this.nuevoDetalle.statusProducto = this.estatusProducto;
		this.nuevoDetalle.fecha_recepcion = formatDate(new Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US"),
		//this.nuevoDetalle.fecha_caducidad =;
		//this.nuevoDetalle.tipoMovimiento =;
	    
		this.recepcionPservices.nuevoDetalleRecepcion(this.nuevoDetalle).then()
		{
		  console.log('nuevo movimiento almacenado');
	
		  this.messageService.clear();
		  this.messageService.add({ key: 'tc', severity: 'info', summary: 'Registro Actualizado' })
		}; */

		// this.nuevoMovimiento = rowData;
		//delete this.clonedDetallesOc[rowData.codigo];

	}

	anular() {

		this.UnaRecepcion.estado = "Anulado";
		this.confirmationService.confirm({

			message: "¿Deses Anular esta Recepcion?",
			accept: () => {

				this.modificarRecepcion(this.UnaRecepcion);

				let dataT = {
					mensaje: "Recepcion de Producto Anulada" + `${this.codigo}`,
					idUsuario: JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario,
					idGerencia: JSON.parse(sessionStorage.getItem('currentUser')).idGerencia
				};

				this.generarNotificacion(dataT);

				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'info', summary: 'Requisicion # ' + `${this.UnaRecepcion.idOrdenCompra}` + ' ha sido anulada' });
				this.UnaRecepcion = {};
				this.isdisabled = true;
				this.detallesOc = [];
				this.nuevoMovimiento = {};
				this.nuevoDetalle = {};
				this.codigo = "";

				/* this.recepcionPservices.AnularRecepcion(this.UnaRecepcion)
				  .then(result => {
		
					console.log('aqui deberia estar seteado como anulado el estatus de:', result);
				 
		
					let dataT = {
					  mensaje: "Recepcion de Producto Anulada" + `${this.codigo}`,
					  idUsuario: JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario,
					  idGerencia: JSON.parse(sessionStorage.getItem('currentUser')).idGerencia
					};
			  
					this.generarNotificacion(dataT);
		
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'info', summary: 'Requisicion # ' + `${this.UnaRecepcion.idOrdenCompra}` + ' ha sido anulada' });
					this.UnaRecepcion = {};
					this.isdisabled = true;
				  }); */

			}
		}
		)
	}

	generarNotificacion(dataT) {

		this.svrNotificaciones.nuevaNotificacion("Estatus RECEPCION DE RODUCTOS" + dataT.mensaje, dataT.idGerencia, 19, dataT.idUsuario).subscribe((resp) => {
			console.log('respuesta servicio notificacion', resp);

			/* this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'info', summary: 'Se ha enviado una notifiacion' }) */
		});
	}

	generarRecepcion() {
		this.isdisabled = false;
		this.UnaRecepcion = {
			idOrdenCompra: this.codigo,
			idEmpresa: this.detallesOc[0].IdComprasEmpresa,
			fecha_registro: formatDate(Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US"),
			numeroItems: this.detallesOc.length,
			idEmpresaProveedor: this.detallesOc[0].idProveedor,
			idGerencia: this.detallesOc[0].idGenCentroCostos,
			idUsuario: this.currentUser.idSegUsuario,
			estado: 'abierta',
		}

		this.recepcionPservices.nuevaRequisicion(this.UnaRecepcion).then(
			result => {
				this.UnaRecepcion = result;
				//console.log('a reception has been  created', result);

			});
	}

	modificarRecepcion(unarecepcion) {
		this.UnaRecepcion = unarecepcion;

		this.recepcionPservices.AnularRecepcion(this.UnaRecepcion)
			.then(result => {
				//console.log('modificando', result)
				return true;

			});

	}

	async procesar() {

		this.UnaRecepcion.TotalProductoRecibido = (this.detallesOc.reduce((sum, value) => (typeof value.cant_encontrada == "number" ? sum + value.cant_encontrada : sum), 0)).toFixed(1);
		console.log(this.UnaRecepcion.TotalProductoRecibido);

		this.UnaRecepcion.TotalProductoRecibiConforme = (this.detallesOc.reduce((sum, value) => (typeof value.cant_recibido == "number" ? sum + value.cant_recibido : sum), 0)).toFixed(1);

		console.log(this.UnaRecepcion);

		if (this.UnaRecepcion.TotalProductoRecibiConforme == this.UnaRecepcion.TotalProductoRecibido) {
			this.UnaRecepcion.estado = "Procesado";

			await this.modificarRecepcion(this.UnaRecepcion)


		} else {
			this.UnaRecepcion.estado = "Parcial";
			await this.modificarRecepcion(this.UnaRecepcion);
		}

		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'info', summary: 'Recepcion Procesada' })
		this.detallesOc = [];
		this.UnaRecepcion = {};
		this.nuevoMovimiento = {};
		this.nuevoDetalle = {};
		this.codigo = "";
		this.empresaproveedor = "";
		this.rifempresa = "";
		this.rifProveedor = "";
		this.nombreEmpresa = "";

	}

	showDialogToAdd(rowData: MovimientoAlmacen) {
		this.newMovimiento = true;
		this.displayDialog = true;
		this.tituloDialogo = "Nuevo Movimiento";		
    
    
	}

	async guardar(){ 
    
		/*if (this.isEmpty(this.srvAdmActivo.admActivo.nombre) == null || this.srvAdmActivo.admActivo.nombre == null || this.srvAdmActivo.admActivo.nombre == undefined || this.srvAdmActivo.admActivo.nombre=='') {
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el nombre del activo' });
				return false;
		}*/	
		  
		if (this.newMovimiento) {
			//acivar en caso de un error al insertar la fecha alta
			//this.srvAdmActivo.admActivo.fechaAlta= formatDate(Date.now(), 'yyyy-MM-dd', 'en');
			/*await this.srvAdmActivo.registrar(this.srvAdmActivo.admActivo)
			  .toPromise()     
			  .then(results => {
				if (!isNaN(this.srvAdmActivo.admActivo.idAdmActivo)){
				  this.registrarAreaNegocio(this.srvAdmActivo.admActivo.idAdmActivo);
				  this.registrarGerenciasAsociadas(this.srvAdmActivo.admActivo.idAdmActivo);
				}           
				
			  })
			  .catch(err => { console.log(err) });     
			*/	   
			this.showSuccess('Movimiento creado satisfactoriamente');
			
		  }
		  else {        
			   
			/*this.srvAdmActivo.admActivo.fechaAlta= formatDate(this.srvAdmActivo.admActivo.fechaAlta, 'yyyy-MM-dd', 'en');        
			this.srvAdmActivo.admActivo.fechaModificacion= formatDate(Date.now(), 'yyyy-MM-dd', 'en');
			
			await this.srvAdmActivo.actualizar(this.srvAdmActivo.admActivo)
			  .toPromise()
			  .then(results => { 
				  this.actualizarListaGcia(this.srvAdmActivo.admActivo.idAdmActivo);
				  this.actualizarListaAreaNegocio(this.srvAdmActivo.admActivo.idAdmActivo);              
				   })
			  .catch(err => { console.log(err) });
			*/
			this.showSuccess('Movimiento actualizado satisfactoriamente');
	
		  }
		  
		  this.displayDialog = false;      
	  }


	onRowEditCancel(detalle_recepcion: recepcionOC, index: number) {

		this.detallesOc2[index] = this.clonedDetallesOc[detalle_recepcion.codigo];
		delete this.clonedDetallesOc[detalle_recepcion.codigo];
		this.detallesOc[index] = this.detallesOc2[index];
		//console.log('pasando para eliminar',delete this.detallesOc2[index])

	}

	async guardarDetalle(rowData: recepcionOC) { /////// detalle Recepecion

		this.nuevoDetalle.idOrdenCompra = rowData.idComprasOC;
		this.nuevoDetalle.idRecepcionOC = this.UnaRecepcion.idRecepcionOC,
			this.nuevoDetalle.idOcDetalle = rowData.idComprasOC;
		this.nuevoDetalle.idProducto = rowData.idProducto;
		this.nuevoDetalle.codigoProducto = rowData.codigo;
		//this.nuevoDetalle.entrada= this.entrada;
		//this.nuevoDetalle.salida= this.salida;
		//this.nuevoDetalle.idAlmacenOrigen = ;
		//this.nuevoDetalle.idAlmacenDestino = ;
		this.nuevoDetalle.idUsuarioProceso = this.currentUser.idSegUsuario;
		//this.nuevoDetalle.idUsuarioAprobacion =;
		this.nuevoDetalle.costoBs = rowData.precio;
		//costoDollar:,
		this.nuevoDetalle.cant_oc = rowData.cant_encontrada;
		this.nuevoDetalle.cant_recibida = rowData.cant_recibido;
		this.nuevoDetalle.cant_conforme = rowData.cant_conforme;
		this.nuevoDetalle.observaciones = rowData.notas;
		this.nuevoDetalle.idActivo = rowData.idAdmActivo,
			//this.nuevoDetalle.AlmacenEsLogico = ?,
			this.nuevoDetalle.id_puesto = rowData.idPuesto;
		this.nuevoDetalle.codigoPuesto = rowData.codigoPuesto;
		this.nuevoDetalle.statusProducto = this.estatusProducto;
		this.nuevoDetalle.fecha_recepcion = formatDate(Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US"),
			//this.nuevoDetalle.fecha_caducidad =;
			//this.nuevoDetalle.tipoMovimiento =;

			await this.recepcionPservices.nuevoDetalleRecepcion(this.nuevoDetalle)
				.then(resp => {
					//this.nuevoDetalle = resp, 
					this.inv_resm.idMovimiento_recepcion = resp.idDetalle;
					this.inv_resm.id_almacen = resp.idAlmacenDestino;
					//console.log('nuevo detalle',resp)
				});
		{

			//this.messageService.clear();
			//this.messageService.add({ key: 'tc', severity: 'info', summary: 'Registro Actualizado' })
		};

		if (this.cargaInventario === true) {
			this.inv_resm.cant_disponible = this.encontrada;
			this.inv_resm.id_Producto = rowData.idProducto;
			this.inv_resm.id_activo = rowData.idAdmActivo;
			this.inv_resm.last_update = formatDate(Date().toString(), "yyyy-MM-dd HH:mm:ss", "en-US");

			this.resumenInv(this.inv_resm);
		}


	}


	async resumenInv(resumen: inventario_resumen) {
		this.inv_resm = resumen;
		//console.log(this.cargaInventario, this.inv_resm);
		await this.recepcionPservices.NuevoRegInv(this.inv_resm)
			.then(//console.log('esta guardando el resumen',resp)
			);

	}

	esMovimiento(rowData: recepcionOC, index: number) {
		this.nuevoMovimiento.alma_mov_inv_id_activo = rowData.idAdmActivo;
		this.nuevoMovimiento.alma_mov_inv_id_cantidad = rowData.cant_recibido;
		this.nuevoMovimiento.alma_mov_inv_entrada = rowData.cant_conforme;
		this.nuevoMovimiento.alma_mov_inv_tipo = "CARGA RECEPCION";
		this.nuevoMovimiento.alma_mov_inv_id_producto = rowData.idProducto;		
		//this.nuevoMovimiento.alma_mov_inv_salida =,
		//this.nuevoMovimiento.alma_mov_inv_id_almacen_origen,
		//this.nuevoMvimiento.alma_mov_inv_id_almacen_destino?,
		this.nuevoMovimiento.alma_mov_inv_id_usuario_proceso = this.currentUser;
		//this.nuevoMovimiento.alma_mov_inv_id_usuario_aprobo =;
		//this.nuevoMovimiento.alma_mov_inv_fecha_solicitud = this.detallesOc[index].fechaRequerida;
		this.nuevoMovimiento.alma_mov_inv_fecha_solicitud = formatDate(Date.now(), 'yyyy-MM-dd', 'en');
		this.nuevoMovimiento.alma_mov_inv_fecha_aprobacion = this.detallesOc[index].fechaAlta;
		//this.nuevoMovimiento.alma_mov_inv_aprobado =;
		//this.nuevoMovimiento.alma_mov_inv_es_logico = ;
		this.nuevoMovimiento.alma_mov_inv_costo = rowData.precio;
		//this.nuevoMovimiento.alma_mov_inv_costo_Dollar = ;
		this.nuevoMovimiento.alma_mov_inv_id_puesto = rowData.idPuesto;
		this.nuevoMovimiento.alma_mov_inv_id_oc = rowData.idComprasOC;
		//this.nuevoMovimiento.alma_mov_inv_lote = ;
		this.nuevoMovimiento.alma_mov_inv_justificacion = rowData.justificacion;
		this.nuevoMovimiento.alma_mov_inv_rif_empresa = rowData.rif;
		//this.nuevoMovimiento.alma_mov_inv_fecha_caducidad = ,
		this.nuevoMovimiento.alm_mov_estatus = this.UnaRecepcion.estado;
		console.log(this.nuevoMovimiento);
		this.recepcionPservices.nuevoMovimientoAlmacen(this.nuevoMovimiento).then(
			resp => {
				console.log('nuevo movmiento', resp);


				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'info', summary: 'Registro Actualizado' })
			}
		);

	}

	cerrar() {
		this.nuevoMovimiento = null;
		this.displayDialog = false;
	}
	
	private isEmpty(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	private showSuccess(successMsg: string) {
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'success', summary: successMsg });
	}

}
