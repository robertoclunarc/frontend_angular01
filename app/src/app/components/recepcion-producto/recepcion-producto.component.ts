import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { recepcionOC } from '../../models/recepcionOC'; //trae la data de la oc preexistente
import { requisicion } from '../../models/requisicion'; //genera la cabecera de la recepcion
import { Unidadmedidas } from '../../models/unidadmedidas'
import { alm_tipos_movimiento } from '../../models/alm-tipos-movimientos';
import { MovimientoAlmacen } from "../../models/MovimientoAlmacen";
//import { recepcion_detalle } from "../../models/recepcion_detalle"; //detalles de recepcion
import { RecepcionProductosService } from '../../services/recepcion-productos.service';
import { UnidadesMedidaService } from '../../services/unidades-medida.service';
import { EmpresacomprasService } from '../../services/empresacompras.service';
import { OrdenCompraService } from '../../services/orden-compra.service';
import { AlmTiposMovimientoService } from '../../services/alm-tipos-movimiento.service';
import { AlmacenesService } from '../../services/almacenes.service'
import { ConfirmationService, MessageService , SelectItem} from 'primeng/api';
import { UsuarioService } from '../../services/config-generales/usuario.service';
import { User } from '../../models/user';
import { Almacenes } from '../../models/almacenes';
import { Puesto } from '../../models/almacen';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto';
import { Iadm_activos } from '../../models/config-generales/Iadm-activos';

import { detalleOcModelo } from '../../models/oc-Detalle';

import { inventario_resumen } from '../../models/inventario';


//import { TsTicketServicioService } from "../../services/ts-ticket-servicio.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { EmpresaCompras } from '../../models/empresa-compras';
import { AdmActivosService } from '../../services/config-generales/adm-activos.service';


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
	//clonedDetallesOc: { [s: string]: recepcionOC; } = {};
	UnaRecepcion: requisicion = {};
	nombreEmpresa: string;
	rifempresa: string;
	nuevaRecepcion: requisicion = {};
	nuevoDetalle: MovimientoAlmacen = {};

	recepciones: MovimientoAlmacen[]=[];
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
	tiposMovimientos: SelectItem[] = [];
	users: User[]=[];
	almacenes: SelectItem[] = [];
	puesto: SelectItem[] = [];
	productos: Producto[]=[];
	estatus: any[];
	estatusNuevo: any[];
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
		private empresasComprasService: EmpresacomprasService,
		private srvUsuarios: UsuarioService,
		private srvTiposMovimiento: AlmTiposMovimientoService,
		private srvAlmacenes: AlmacenesService,
		private srvProducto: ProductosService,
		private srvActivos: AdmActivosService) { }

	ngOnInit() {
		this.idOC=this.actRouter.snapshot.params.idOc;
		this.llenarProductos();
		this.llenarUnidadMedida();
		this.llenarEmpresasCompras();
		this.llenarUsuarios();
		this.llenarTiposMovimiento();
		this.llenarAlmacen();
		
		this.ObtenerDetallesOc(this.idOC);
		//console.log(this.currentUser);
		
		this.estatus = [
			{ label: 'APROBADO', value: 'APROBADO' },
			{ label: 'RECHAZADO', value: 'RECHAZADO' },
			{ label: 'PAUSADO', value: 'PAUSADO' },
			{ label: 'ESPERA', value: 'ESPERA' },
		];
	}

	async ObtenerDetallesOc(codigo) {
		this.isdisabled = false;
		this.readOnly = false;
		this.codigo = codigo;
		
		//await this.recepcionPservices.ObtenerDetalleOc(this.codigo) //recithisbe la data de la orden de compra
		this.detallesOc = await this.OrdenCompraService.getDetallesPorOCpromise(codigo);
		  	
			//.then(result => {
			//	this.detallesOc = result;
				if (this.detallesOc.length <= 0) {
					
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'info', summary: 'NO EXISTE LA ORDEN DE COMPRA, VERIFIQUE EL CODIGO' })

				} else {

					for (const d of this.detallesOc) {
						d.idProducto= this.productos.find(p => p.codigo == d.codigo).idAdmProducto;
						
						d.unidadMedidaNombre = this.unidMedidas.find(u => u.idAdmUnidadMedida== d.unidadMedidaC).abrev;
						d.nombreEmpresa = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).nombre_empresa;
						d.rif = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).rif;	
						
					}
		  
					//this.completarInformacion();
					/*this.detallesOc.forEach(d => {
						
						d.idProducto= this.productos.find(p => p.codigo == d.codigo).idAdmProducto;
						
						d.unidadMedidaNombre = this.unidMedidas.find(u => u.idAdmUnidadMedida== d.unidadMedidaC).abrev;
						d.nombreEmpresa = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).nombre_empresa;
						d.rif = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).rif;						
						
					});*/
					this.nombreEmpresa = this.empresasCompra.find(e => e.IdComprasEmpresa == this.detallesOc[0].IdComprasEmpresa).nombre_empresa;
					this.rifempresa = this.empresasCompra.find(e => e.IdComprasEmpresa == this.detallesOc[0].IdComprasEmpresa).rif;
					
					this.onSearch(this.detallesOc);
					
				}
			//});
	}	

	async llenarUnidadMedida (){		
		await this.UnidadesMedidaService.consultarTodosPromise()
			.then(result => {
				this.unidMedidas=result;				
			})		
	}

	async llenarTiposMovimiento (){		
		await this.srvTiposMovimiento.getAll()						
			.then(data => {
				this.tiposMovimientos = [];
				data.forEach(tip => {
					this.tiposMovimientos.push({ label: tip.descripcion, value: tip.idAlmTipoMov });
				});
			})		
	}

	async llenarEmpresasCompras (){		
		this.empresasCompra = await this.empresasComprasService.getTodos();			
	}

	async llenarUsuarios (){		
		this.users = await this.srvUsuarios.consultarTodos().toPromise();
			
	}

	async llenarAlmacen(){
		const almacenes: Almacenes[] = await this.srvAlmacenes.TodosLosRegistros();
		//almacenes = await this.srvAlmacenes.TodosLosRegistros();		
		this.almacenes = [];
		//for (const d of this.detallesOc) {

		//}
		almacenes.forEach(alm => {
			this.almacenes.push({ label: alm.descripcion, value: alm.idAlmacenes });
		});				
		
	}

	async llenarProductos(){
		
		this.productos=await this.srvProducto.getAll();
			
	}

	async llenarPuesto(codigo: string){
		let prod= this.productos.find(p => p.codigo===codigo);
		let puestosXprod: Puesto[];
		await this.srvAlmacenes.getPuesto()	
			.then(data => {
				puestosXprod=data.filter(pu=> pu.idAdmProducto==prod.idAdmProducto);
				this.puesto = [];
				data.forEach(pu => {
					this.almacenes.push({ label: pu.descripcion, value: pu.idAdmPuesto });
				});	
			})
		
	}

	onSearch(detallesOc: recepcionOC[]) {

		this.detallesOc = detallesOc;

		this.recepciones = [];
		//console.log('resulta:', detallesOc);
		this.nombreEmpresa = this.detallesOc[0].nombreEmpresa;
		this.rifempresa = this.detallesOc[0].rif;
		this.empresaproveedor = this.detallesOc[0].nombreProveedor;
		this.rifProveedor = this.detallesOc[0].rifProveedor;

		let idOc = this.detallesOc[0].idComprasOC;

		this.recepcionPservices.FindRecepcion(idOc).subscribe(
			result => {
				this.recepciones = result;
				this.recepciones.forEach(r => {
					r.id_usuario_proceso = this.users.find(u => u.idSegUsuario== r.id_usuario_proceso).usuario;
					r.tipo = this.tiposMovimientos.find(t => t.value==r.tipo).label;
					
				});

				//console.log('encontro una recepcion asociada', this.UnaRecepcion);
				/*if (!result || result == null) {
					this.isdisabled = true;//this.generarRecepcion();
				} else if (this.UnaRecepcion.estado == "Anulado") {
					this.isdisabled = true;
				} else if (this.UnaRecepcion.estado == "Procesado") {
					this.isdisabled = true;
				}*/
			},
			err => console.log(err)  
		);
	}

	/*
	onRowEditInit(rowData: recepcionOC) {

		this.clonedDetallesOc[rowData.codigo] = { ...rowData };
		this.readOnly = false;
		if (rowData.cant_encontrada == rowData.cant_recibido && rowData.cant_encontrada == rowData.cant_conforme && rowData.cant_encontrada!=0) {

			//let desacttivar = document.getElementById(index + 'boton') as HTMLElement;*
			//desacttivar.hasAttribute(`disabled = "true"`);
			///console.log(desacttivar); 
			this.readOnly = true;
		} else {
			this.readOnly = false;
		}
	}
	*/

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
		//this.esMovimiento(rowData, index);

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
/*
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

		this.recepcionPservices.nuevoDetalleRecepcion(this.UnaRecepcion).then(
			result => {
				this.UnaRecepcion = result;
				//console.log('a reception has been  created', result);

			});
	}
*/
	modificarRecepcion(unarecepcion) {
		this.UnaRecepcion = unarecepcion;

		/*this.recepcionPservices.AnularRecepcion(this.UnaRecepcion)
			.then(result => {
				//console.log('modificando', result)
				return true;

			});
*/
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

	async completarInformacion(){
		let prd: Producto;
		let activo:Iadm_activos;
		this.detallesOc.forEach(d => {
			
			prd = this.productos.find(p => p.codigo == d.codigo);
			console.log(prd);
			activo = {
				idAdmActivo: null,
				nombre: null,
				descripcion: null,
				serial: null,
				idAdmProducto: prd.idAdmProducto,
				idComprasEmpresa: null
			};

			this.srvActivos.viewFromAnyField(activo)
				.toPromise()
				.then(result => {
					activo = result[0];
				});

			d.idProducto = prd.idAdmProducto
			d.idAdmActivo = activo.idAdmActivo;
			d.unidadMedidaNombre = this.unidMedidas.find(u => u.idAdmUnidadMedida == d.unidadMedidaC).abrev;
			d.nombreEmpresa = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).nombre_empresa;
			d.rif = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).rif;

		});

	}

	async showDialogToAdd(rowData: recepcionOC) {
		
		this.nuevoMovimiento={
			id_oc: rowData.idOcDetalle,
			id_usuario_proceso: this.currentUser.idSegUsuario,
			salida: null,
			entrada: null,
			tipo: null,
			id_producto: null,
			id_almacen_origen: null,
			id_almacen_destino: null,
			id_usuario_aprobo: null,
			fecha_solicitud: null,
			fecha_aprobacion: null,
			id_activo: null,
			es_logico: null,
			costo: null,
			costo_Dollar: null,
			id_puesto: null,
			lote: null,
			justificacion: null,
			fecha_caducidad: null,
			estatus: null
		};
		this.newMovimiento = true;
		this.displayDialog = true;
		this.tituloDialogo = "Nuevo Movimiento";
			
		await this.llenarPuesto(rowData.codigo);
		this.estatusNuevo=this.estatus.filter(e => e.value == 'ESPERA');
		
	}

	async guardar(){ 
    
		if (this.isEmpty(this.nuevoMovimiento.tipo) == null || this.nuevoMovimiento.tipo == null || this.nuevoMovimiento.tipo == undefined || this.nuevoMovimiento.tipo=='') {
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el tipo de movimiento' });
				return false;
		}
		
		if (this.nuevoMovimiento.entrada != null && this.nuevoMovimiento.salida != null) 
			if (this.nuevoMovimiento.entrada != '' && this.nuevoMovimiento.salida != '') 
				if (this.nuevoMovimiento.entrada > 0 && this.nuevoMovimiento.salida > 0) {
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar solo cantidad entrada o cantidad salida, No ambos.' });
					return false;
				}
				
		if (this.nuevoMovimiento.es_logico == null ) {
			this.nuevoMovimiento.es_logico=0;
		}		
		
		if (this.newMovimiento) {
			
			this.nuevoMovimiento.fecha_solicitud= formatDate(Date.now(), 'yyyy-MM-dd', 'en');
			this.nuevoMovimiento.fecha_caducidad= formatDate(this.nuevoMovimiento.fecha_caducidad, 'yyyy-MM-dd', 'en')
			console.log(this.nuevoMovimiento);
			await this.recepcionPservices.nuevaRecepcion(this.nuevoMovimiento)
			    
			  .then(results => {
				
				this.recepciones.push(this.nuevoMovimiento)
				
			  })
			  .catch(err => { console.log(err) });     
				   
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


	/*onRowEditCancel(detalle_recepcion: recepcionOC, index: number) {

		this.detallesOc2[index] = this.clonedDetallesOc[detalle_recepcion.codigo];
		delete this.clonedDetallesOc[detalle_recepcion.codigo];
		this.detallesOc[index] = this.detallesOc2[index];
		//console.log('pasando para eliminar',delete this.detallesOc2[index])

	}*/
	

	handleChange(e, nuevoMovimiento) {
		nuevoMovimiento.es_logico = (e.checked == true ? 1 : 0);

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