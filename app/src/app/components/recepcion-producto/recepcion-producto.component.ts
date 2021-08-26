import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { recepcionOC } from '../../models/recepcionOC'; //trae la data de la oc preexistente
import { OrdenCompra } from '../../models/orden-compra';
import { Unidadmedidas } from '../../models/unidadmedidas'
import { alm_tipos_movimiento } from '../../models/alm-tipos-movimientos';
import { MovimientoAlmacen } from "../../models/MovimientoAlmacen";
import { RecepcionProductosService } from '../../services/recepcion-productos.service';
import { UnidadesMedidaService } from '../../services/unidades-medida.service';
import { EmpresacomprasService } from '../../services/empresacompras.service';
import { OrdenCompraService } from '../../services/orden-compra.service';
import { AlmTiposMovimientoService } from '../../services/alm-tipos-movimiento.service';
import { AlmacenesService } from '../../services/almacenes.service'
import { ConfirmationService, MessageService , SelectItem} from 'primeng/api';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Almacenes } from '../../models/almacenes';
import { Puesto } from '../../models/almacen';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto';
import { Iadm_activos } from '../../models/config-generales/Iadm-activos';
import { TrazasocService } from '../../services/trazasoc.service';
import { TrazaOc } from '../../models/traza-oc';
//import { inventario_resumen } from '../../models/inventario';
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
	//UnaRecepcion: requisicion = {};
	nombreEmpresa: string;
	rifempresa: string;
	detalleOc2: recepcionOC = {};
	nuevoDetalle: MovimientoAlmacen = {};	
	user: number;
	recepciones: MovimientoAlmacen[]=[];
	empresaproveedor: string;
	rifProveedor: string;
	codigo: string;
	estatusProducto: string;
	setEstado: string;
	cabeceraOc: OrdenCompra = {};
	//inv_resm: inventario_resumen = {};
	isdisabled: boolean;
	readOnly: boolean;
	cargaInventario: boolean;
	recibido: number;
	conforme: number;
	encontrada: number;
	unidMedidas: Unidadmedidas[]=[];
	empresasCompra: EmpresaCompras[]=[];
	tiposMovimientos: alm_tipos_movimiento[] = [];
	users: User[]=[];
	almacenes: SelectItem[] = [];
	almacDestino: SelectItem[] = [];
	puesto: Puesto[] = [];
	productos: Producto[]=[];	
	activos: Iadm_activos[]=[];
	//ticket: TicketServicio = {};
	idUsuario: number;
	idGerencia: number;
	displayDialog: boolean;
	newMovimiento: boolean;
	tituloDialogo: string;
	idOC: number;
	operacion: string = 'RECEPCION';
	
	cantidad_total: number =0;
	

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
		private srvActivos: AdmActivosService,
		private srvTrazaOC: TrazasocService) { }

	async ngOnInit() {
		this.idOC=this.actRouter.snapshot.params.idOc;
		this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
		await this.llenarProductos();//backend
		await this.llenarActivos();
		await this.llenarUnidadMedida();//backend
		await this.llenarEmpresasCompras();
		await this.llenarUsuarios();//backend
		await this.llenarTiposMovimiento();
		this.llenarAlmacen();		
		this.ObtenerDetallesOc(this.idOC);
		//console.log(this.currentUser);		
	}
	
	async ObtenerDetallesOc(codigo) {
		this.isdisabled = false;
		this.readOnly = false;
		this.codigo = codigo;
		this.cantidad_total =0;
		this.detallesOc = await this.OrdenCompraService.getDetallesPorOCpromise(codigo);		  	
		this.cabeceraOc = await this.OrdenCompraService.getOcOne(codigo).toPromise();	
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
				if (d.cant_encontrada!=null){
					this.cantidad_total=this.cantidad_total + d.cant_encontrada;
				}
				
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
		this.tiposMovimientos = await this.srvTiposMovimiento.getAll();		
	}	

	async llenarEmpresasCompras (){		
		this.empresasCompra = await this.empresasComprasService.getTodos();			
	}

	async llenarUsuarios (){		
		this.users = await this.srvUsuarios.getAll().toPromise();
			
	}

	async llenarAlmacen(){
		const almacenes: Almacenes[] = await this.srvAlmacenes.TodosLosRegistros();			
		this.almacenes = [];
		this.almacDestino = [];
		
		for (const alm of almacenes) {
			if (alm.nombre=="COMPRAS"){
				this.almacenes.push({ label: alm.descripcion, value: alm.idAlmacenes });
			}
			if (alm.idGerencia==this.idGerencia){
				this.almacDestino.push({ label: alm.descripcion, value: alm.idAlmacenes });
			}			
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
			this.puesto.push({ descripcion : pu.descripcion, idAdmPuesto: pu.idAdmPuesto });
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
					//r.tipo = this.tiposMovimientos.find(t => t.idAlmTipoMov==r.tipo).descripcion
					
				});

			},
			err => console.log(err)  
		);
	}

	private anular() {

		//this.UnaRecepcion.estado = "Anulado";
		this.confirmationService.confirm({

			message: "¿Deses Anular esta Recepcion?",
			accept: () => {


				let dataT = {
					mensaje: "Recepcion de Producto Anulada" + `${this.codigo}`,
					idUsuario: JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario,
					idGerencia: JSON.parse(sessionStorage.getItem('currentUser')).idGerencia
				};

				//this.generarNotificacion(dataT);

				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'info', summary: 'Requisicion ha sido anulada' });
				//this.UnaRecepcion = {};
				this.isdisabled = true;
				this.detallesOc = [];
				this.nuevoMovimiento = {};
				this.nuevoDetalle = {};
				this.codigo = "";
			}
		}
		)
	}

	/*
	generarNotificacion(dataT) {

		this.svrNotificaciones.nuevaNotificacion("Estatus RECEPCION DE RODUCTOS" + dataT.mensaje, dataT.idGerencia, 19, dataT.idUsuario).subscribe((resp) => {
			console.log('respuesta servicio notificacion', resp);

			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'info', summary: 'Se ha enviado una notifiacion' }) 
		});
	}
	*/

	async llenarActivos(){
		
		this.activos= await this.srvActivos.consultarTodos().toPromise();
		
	}

	async update(rowData: MovimientoAlmacen) {		
		this.detalleOc2=rowData;		
		this.newMovimiento = false;
		this.displayDialog = true;
		this.tituloDialogo = "Actualizar Movimiento";	
		this.nuevoMovimiento=rowData;		
		//this.tipo = this.tiposMovimientos.find(tm => tm.label===this.nuevoMovimiento.tipo).value;
		this.user = this.users.find(u => u.usuario === this.nuevoMovimiento.id_usuario_proceso).idSegUsuario;
	}

	async showDialogToAdd(rowData: recepcionOC) {
		this.puesto=[];
		this.detalleOc2=rowData;

		this.nuevoMovimiento={
			id_oc: rowData.idComprasOC,
			id_usuario_proceso: parseInt(this.currentUser.idSegUsuario),
			salida: null,
			entrada: null,
			tipo: this.tiposMovimientos.find(t => t.descripcion==="COMPRAS").idAlmTipoMov,
			id_producto: parseInt(rowData.idProducto),
			id_almacen_origen: null,
			id_almacen_destino: null,
			id_usuario_aprobo: parseInt(this.currentUser.idSegUsuario),
			fecha_solicitud: formatDate(Date.now(), 'yyyy-MM-dd', 'en'),
			fecha_aprobacion: formatDate(Date.now(), 'yyyy-MM-dd', 'en'),
			id_activo: rowData.idAdmActivo,
			es_logico: 0,
			costo: rowData.precio,
			costo_Dollar: null,
			id_puesto: null,
			lote: null,
			justificacion: null,
			fecha_caducidad: null,
			estatus: "APROBADO",
			rif_empresa: rowData.rifProveedor
		};
		if 	(rowData.cant_recibido!=null){	
			this.detalleOc2.cant_encontrada = rowData.cant_encontrada - rowData.cant_recibido;
		} else {
			this.detalleOc2.cant_encontrada = rowData.cant_encontrada;
		}
		if (rowData.cant_recibido!=null){
			this.detalleOc2.cant_recibido = rowData.cant_recibido
		} else {
			this.detalleOc2.cant_recibido = 0
		}

		await this.llenarPuesto(rowData.codigo);
		
		this.newMovimiento = true;
		this.displayDialog = true;
		this.tituloDialogo = "Nuevo Movimiento";	
		
	}

	async guardar(){
		
		if (this.nuevoMovimiento.entrada == null || this.nuevoMovimiento.entrada == 0 || this.nuevoMovimiento.entrada == ''){			
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar cantidad de entrada' });
			return false;
		}

		if (this.puesto.length > 0){
			this.nuevoMovimiento.id_puesto = this.puesto[0].idAdmPuesto;
		}
		else{
			this.nuevoMovimiento.id_puesto = null;
		}
		
		if (this.nuevoMovimiento.entrada > this.detalleOc2.cant_encontrada && this.operacion=="RECEPCION"){
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'La cantidad de entrada no puede ser mayor que ' + this.detalleOc2.cant_encontrada  });
			return false;
		}

		this.detalleOc2.cant_encontrada = this.detalleOc2.cant_encontrada + this.nuevoMovimiento.entrada;
		
		this.nuevoMovimiento.costo = this.nuevoMovimiento.entrada * this.nuevoMovimiento.costo;
		
		if (this.newMovimiento) {			
			let trazaOc: TrazaOc ={
				 
				fechaAlta: formatDate(Date.now(), 'yyyy-MM-dd', 'en'), 
				justificacion: this.nuevoMovimiento.justificacion, 
				idComprasOC: this.nuevoMovimiento.id_oc, 
				idEstadoOC: 3, 
				estadoActual: "APROBADO",
				idSegUsuario: parseInt(this.currentUser.idSegUsuario), 
				estadoAnterior: this.cabeceraOc.estadoActual
				
			};			
			console.log(this.nuevoMovimiento);
			await this.recepcionPservices.nuevaRecepcion(this.nuevoMovimiento)			    
			  .then(results => {
				this.nuevoMovimiento.id_usuario_proceso=this.users.find(u => u.idSegUsuario== this.nuevoMovimiento.id_usuario_proceso).usuario;				
				this.recepciones.push(this.nuevoMovimiento);
				console.log(trazaOc);
				this.srvTrazaOC.insertTrazaOc(trazaOc);
				this.showSuccess('Movimiento creado satisfactoriamente');
				//this.procesar();
			  })
			  .catch(err => { console.log(err) });			
		  }
		else {			

			this.nuevoMovimiento.id_usuario_proceso= this.user;
			
			//this.nuevoMovimiento.fecha_solicitud= formatDate(this.nuevoMovimiento.fecha_solicitud, 'yyyy-MM-dd', 'en');
			//this.nuevoMovimiento.fecha_aprobacion= formatDate(this.nuevoMovimiento.fecha_aprobacion, 'yyyy-MM-dd', 'en');
						
				await this.recepcionPservices. actualizarRecepcion(this.nuevoMovimiento)
				.then(results => {
						
						this.showSuccess('Movimiento Actualizado en el Inventario');
						this.nuevoMovimiento.id_usuario_proceso=this.users.find(u => u.idSegUsuario== this.user).usuario;
						
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
		this.detalleOc2=null;
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