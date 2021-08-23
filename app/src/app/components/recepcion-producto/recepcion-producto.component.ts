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
import { UserService } from '../../services/user.service';
//import { UsuarioService } from '../../services/config-generales/usuario.service';
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
	nuevaRecepcion: recepcionOC = {};
	nuevoDetalle: MovimientoAlmacen = {};
	tipo: number;
	user: number;

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
	activos: Iadm_activos[]=[];
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
		private srvUsuarios: UserService,
		private srvTiposMovimiento: AlmTiposMovimientoService,
		private srvAlmacenes: AlmacenesService,
		private srvProducto: ProductosService,
		private srvActivos: AdmActivosService) { }

	async ngOnInit() {
		this.idOC=this.actRouter.snapshot.params.idOc;
		await this.llenarProductos();//backend
		await this.llenarActivos();
		await this.llenarUnidadMedida();//backend
		await this.llenarEmpresasCompras();
		await this.llenarUsuarios();//backend
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

	// comenatrio
	async ObtenerDetallesOc(codigo) {
		this.isdisabled = false;
		this.readOnly = false;
		this.codigo = codigo;
		
		this.detallesOc = await this.OrdenCompraService.getDetallesPorOCpromise(codigo);		  	
			
		if (this.detallesOc.length <= 0) {
			
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'info', summary: 'NO EXISTE LA ORDEN DE COMPRA, VERIFIQUE EL CODIGO' })

		} else {
			
			let unidaMedida: number;
			for (const d of this.detallesOc) {
				
				d.idProducto= this.productos.find(p => p.codigo === d.codigo).idAdmProducto;
				unidaMedida = this.productos.find(p => p.codigo === d.codigo).idAdmUnidadMedida;
				d.idAdmActivo = this.activos.find(a => a.idAdmProducto===d.idProducto);
				d.unidadMedidaNombre = this.unidMedidas.find(u => u.idAdmUnidadMedida== unidaMedida).abrev || d.unidadMedidaC;
				d.nombreEmpresa = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).nombre_empresa || null;
				d.rif = this.empresasCompra.find(e => e.IdComprasEmpresa == d.IdComprasEmpresa).rif;
				
			}
			this.detallesOc.sort((a,b) => a.idProducto - b.idProducto  );
			this.nombreEmpresa = this.empresasCompra.find(e => e.IdComprasEmpresa == this.detallesOc[0].IdComprasEmpresa).nombre_empresa;
			this.rifempresa = this.empresasCompra.find(e => e.IdComprasEmpresa == this.detallesOc[0].IdComprasEmpresa).rif;
			
			this.onSearch(this.detallesOc);
			
		}
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
		this.users = await this.srvUsuarios.getAll().toPromise();
			
	}

	async llenarAlmacen(){
		const almacenes: Almacenes[] = await this.srvAlmacenes.TodosLosRegistros();
		//almacenes = await this.srvAlmacenes.TodosLosRegistros();		
		this.almacenes = [];
		for (const alm of almacenes) {
			this.almacenes.push({ label: alm.descripcion, value: alm.idAlmacenes });
		}						
		
	}

	async llenarProductos(){		
		this.productos=await this.srvProducto.consultarTodos().toPromise();
		/*.then(result => {
			this.productos=result;				
		})*/			
	}

	async llenarPuesto(codigo: string){
		const prod= this.productos.find(p => p.codigo===codigo);
		let puestosXprod: Puesto[]=await this.srvAlmacenes.getPuesto();
		puestosXprod=puestosXprod.filter(pu=> pu.idAdmProducto==prod.idAdmProducto);
		for (const pu of puestosXprod) {
			this.puesto.push({ label: pu.descripcion, value: pu.idAdmPuesto });
		}
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


	anular() {

		this.UnaRecepcion.estado = "Anulado";
		this.confirmationService.confirm({

			message: "¿Deses Anular esta Recepcion?",
			accept: () => {


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

	

	async procesar() {
        let recep: MovimientoAlmacen[]=this.recepciones.filter(r => r.estatus==='APROBADO');

		const entradas = (recep.reduce((sum, value) => (typeof value.entrada == "number" ? sum + value.entrada : sum), 0)).toFixed(1);
		//console.log(this.UnaRecepcion.TotalProductoRecibido);

		//this.UnaRecepcion.TotalProductoRecibiConforme = (this.detallesOc.reduce((sum, value) => (typeof value.cant_recibido == "number" ? sum + value.cant_recibido : sum), 0)).toFixed(1);

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

	async llenarActivos(){
		
		this.activos= await this.srvActivos.consultarTodos().toPromise();
		
	}

	async update(rowData: MovimientoAlmacen) {		
		console.log(rowData);	
		//await this.llenarPuesto(rowData.codigo);
		this.nuevaRecepcion=rowData;
		this.estatusNuevo=this.estatus;
		this.newMovimiento = false;
		this.displayDialog = true;
		this.tituloDialogo = "Actualizar Movimiento";	
		this.nuevoMovimiento=rowData;
		this.nuevoMovimiento.fecha_caducidad=new Date(this.nuevoMovimiento.fecha_caducidad);
		
		if (this.nuevoMovimiento.fecha_aprobacion!=null){
			this.nuevoMovimiento.fecha_aprobacion=formatDate(this.nuevoMovimiento.fecha_aprobacion, 'dd/MM/yyyy', 'en');//new Date(this.nuevoMovimiento.fecha_aprobacion);
			//console.log(this.nuevoMovimiento.id_usuario_aprobo);
			//this.nuevoMovimiento.id_usuario_aprobo = this.users.find(u => u.usuario === this.nuevoMovimiento.id_usuario_aprobo).idSegUsuario;
		}	
		this.tipo = this.tiposMovimientos.find(tm => tm.label===this.nuevoMovimiento.tipo).value;
		this.user = this.users.find(u => u.usuario === this.nuevoMovimiento.id_usuario_proceso).idSegUsuario;	
		
	}

	async showDialogToAdd(rowData: recepcionOC) {
		this.puesto=[];
		this.nuevaRecepcion=rowData;

		this.nuevoMovimiento={
			id_oc: rowData.idOcDetalle,
			id_usuario_proceso: this.currentUser.idSegUsuario,
			salida: null,
			entrada: null,
			tipo: null,
			id_producto: rowData.idProducto,
			id_almacen_origen: null,
			id_almacen_destino: null,
			id_usuario_aprobo: null,
			fecha_solicitud: null,
			fecha_aprobacion: null,
			id_activo: rowData.idAdmActivo,
			es_logico: null,
			costo: rowData.precio,
			costo_Dollar: null,
			id_puesto: null,
			lote: null,
			justificacion: null,
			fecha_caducidad: null,
			estatus: null
		};
		this.tipo=null;	
		
		await this.llenarPuesto(rowData.codigo);
		this.estatusNuevo=this.estatus.filter(e => e.value == 'APROBADO');
		this.newMovimiento = true;
		this.displayDialog = true;
		this.tituloDialogo = "Nuevo Movimiento";	
		
	}

	async guardar(){ 
    
		if (this.isEmpty(this.tipo) == null || this.tipo == null || this.tipo == undefined ) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el tipo de movimiento' });
			return false;
		}
		
		this.nuevoMovimiento.tipo=this.tipo;

		if (this.nuevoMovimiento.entrada == null && this.nuevoMovimiento.salida == null){			
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar cantidad entrada o cantidad salida' });
			return false;
		}
		
		if (this.nuevoMovimiento.entrada != null && this.nuevoMovimiento.salida != null) 
			if (this.nuevoMovimiento.entrada != '' && this.nuevoMovimiento.salida != '') 
				if (this.nuevoMovimiento.entrada > 0 && this.nuevoMovimiento.salida > 0) {
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar solo cantidad entrada o cantidad salida, No ambos.' });
					return false;
				}

		/*if (this.nuevoMovimiento.entrada!=null && this.nuevoMovimiento.entrada>this.nuevaRecepcion.cant_encontrada){
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'error', summary: `La entrada no puede ser mayor que ${this.nuevaRecepcion.cant_encontrada}` });
					return false;
		}*/

		/*if (this.nuevoMovimiento.salida!=null && this.nuevoMovimiento.salida>this.nuevaRecepcion.cant_encontrada){
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: `La salida no puede ser mayor que ${this.nuevaRecepcion.cant_encontrada}` });
			return false;
		}*/
				
		if (this.nuevoMovimiento.es_logico == null ) {
			this.nuevoMovimiento.es_logico=0;
		}
		
		this.nuevoMovimiento.fecha_caducidad= formatDate(this.nuevoMovimiento.fecha_caducidad, 'yyyy-MM-dd', 'en');
		
		
		if (this.newMovimiento) {

			if (this.nuevoMovimiento.estatus=='APROBADO') {
				this.nuevoMovimiento.fecha_aprobacion= formatDate(Date.now(), 'yyyy-MM-dd', 'en');
				this.nuevoMovimiento.id_usuario_aprobo= parseInt(this.currentUser.idSegUsuario);
			} 
			
			this.nuevoMovimiento.fecha_solicitud= formatDate(Date.now(), 'yyyy-MM-dd', 'en');			
			console.log(this.nuevoMovimiento);
			await this.recepcionPservices.nuevaRecepcion(this.nuevoMovimiento)			    
			  .then(results => {
				this.nuevoMovimiento.id_usuario_proceso=this.users.find(u => u.idSegUsuario== this.nuevoMovimiento.id_usuario_proceso).usuario;
				this.nuevoMovimiento.tipo = this.tiposMovimientos.find(t => t.value==this.nuevoMovimiento.tipo).label;
				this.recepciones.push(this.nuevoMovimiento)
				this.showSuccess('Movimiento creado satisfactoriamente');
				//this.procesar();
			  })
			  .catch(err => { console.log(err) });			
		  }
		else {
			if (this.nuevoMovimiento.estatus=='APROBADO' && this.nuevoMovimiento.fecha_aprobacion==null) {
				this.nuevoMovimiento.fecha_aprobacion= formatDate(Date.now(), 'yyyy-MM-dd', 'en');
				this.nuevoMovimiento.id_usuario_aprobo= parseInt(this.currentUser.idSegUsuario);
			}

			this.nuevoMovimiento.id_usuario_proceso= this.user;
			
			this.nuevoMovimiento.fecha_solicitud= formatDate(this.nuevoMovimiento.fecha_solicitud, 'yyyy-MM-dd', 'en');
						
				await this.recepcionPservices. actualizarRecepcion(this.nuevoMovimiento)
				.then(results => {
						
						this.showSuccess('Movimiento Actualizado en el Inventario');
						this.nuevoMovimiento.id_usuario_proceso=this.users.find(u => u.idSegUsuario== this.user).usuario;
						this.nuevoMovimiento.tipo = this.tiposMovimientos.find(t => t.value==this.nuevoMovimiento.tipo).label;
						this.user=null;
					})
				.catch(err => { console.log(err) });
		  }
		 
		  this.displayDialog = false;      
	  }

	handleChange(e, nuevoMovimiento) {
		nuevoMovimiento.es_logico = (e.checked == true ? 1 : 0);
		
	}

	cerrar() {
		this.nuevoMovimiento = null;
		this.displayDialog = false;
		this.nuevaRecepcion=null;
		this.tipo=null;
		this.user=null;
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