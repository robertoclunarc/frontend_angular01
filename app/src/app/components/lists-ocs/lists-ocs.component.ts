import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { TrazasocService } from './../../services/trazasoc.service';
import { TrazaOc } from './../../models/traza-oc';
import { EstadosOC } from './../../models/orden-compra';
import { OrdenCompraDetalleService } from './../../services/orden-compra-detalle.service';
// import { detalleOcModelo } from 'src/app/models/oc-Detalle';
import { OrdenCompraService } from './../../services/orden-compra.service';
import { Component, OnInit } from '@angular/core';
import { OrdenCompra } from 'src/app/models/orden-compra';
// import {  } from 'primeng-lts/api/confirmationservice';
// import { MessageService, ConfirmationService } from 'primeng-lts/api';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
	selector: 'app-lists-ocs',
	templateUrl: './lists-ocs.component.html',
	styleUrls: ['./lists-ocs.component.scss'],
	providers: [MessageService, ConfirmationService]

})
export class ListsOcsComponent implements OnInit {

	cols: any[];
	ordenesCompras: OrdenCompra[] = [];
	ocSelected: OrdenCompra = {};
	displayDialog: boolean = false;
	displayPrint: boolean = false;
	displayForm: boolean = false;
	tituloHeader: string = "Detalle";
	idUsuario: any;
	idGerencia: any;
	rolesUsrSesion: any;
	verBotonMod: number;
	verBotonAprobar: number;
	permisoCambiarCorrelativo: number;
	verBoton: number;
	rolModtasa: string = "ROL-MOD-OC-TASA";
	reAprobarOC: string = "ROL-REAPROBAR-OC";
	cambiarCorrelativo: string = "ROL-CAMBIAR-CORRELATIVO-OC";

	paramHistorico: number = -1;


	constructor(private srvOc: OrdenCompraService, private svrOcDetalles: OrdenCompraDetalleService,
		private svrTrazaOC: TrazasocService,
		private messageService: MessageService, private confirmationService: ConfirmationService,
		private route: ActivatedRoute) { }

	ngOnInit(): void {

		this.idUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
		this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
		this.rolesUsrSesion = JSON.parse(localStorage.getItem('roles'));
		this.verBotonMod = (JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo === this.rolModtasa) != null ? 1 : 0);
		this.verBotonAprobar = (JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo === this.reAprobarOC) != null ? 1 : 0);
		this.permisoCambiarCorrelativo = 1;

		this.route.params.subscribe((params) => {
			this.paramHistorico = +params['his'];
			console.log("param", this.paramHistorico);
			this.cargardata();
		});

		this.cols = [
			{ field: '', header: '', witdh: "5%" },
			{ field: 'nro', header: 'Nro', witdh: "7%" },
			{ field: 'correlativo', header: 'Corre.', witdh: "10%" },
			//{ field: 'fechaAlta', header: 'Fecha', witdh: "10%" },
			{ field: 'proposito', header: 'Proposito', witdh: "15%" },
			{ field: 'proveedor', header: 'Proveedor', witdh: "15%" },
			{ field: 'monto_total', header: 'Monto', witdh: "10%" },
			{ field: 'fecha', header: 'Fecha', witdh: "10%" },
			{ field: 'estado', header: 'Estado', witdh: "7%" },
			{ field: 'tasa', header: 'Tasa', witdh: "10%" },
			{ field: 'nombre_empresa_facturar', header: 'nombre_empresa_facturar', width: '0%', display: "none" },

		];




		this.cargardata();
	}

	async cargardata() {
		this.ordenesCompras = [... !(this.paramHistorico) ? await this.srvOc.getListado().toPromise() : await this.srvOc.getListadoHis().toPromise()];
	}

	verDetalle(oc: OrdenCompra) {
		this.tituloHeader = "Deatalle OC";
		this.ocSelected = {};
		this.ocSelected = { ...oc };
		this.displayDialog = false;
		this.displayDialog = !this.displayDialog;

	}

	verPrintOC(oc: OrdenCompra) {
		this.tituloHeader = "Vista Previa";
		this.ocSelected = {};
		this.ocSelected = { ...oc };
		this.displayPrint = !this.displayDialog;
	}

	async correlativo(oc: OrdenCompra) {
		// console.log(oc.correlativo);
		await this.srvOc.updateCorrelativo(oc.idComprasOC, oc).toPromise();
		this.cargardata();
	}

	onRowEditInit(oc: OrdenCompra) {
		console.log(oc);

	}

	onRowEditCancel(oc: OrdenCompra, indice: number) {

	}

	private acondicianarOc(oc: OrdenCompra) {
		delete oc.nombre_activo;
		delete oc.nombre_aprobo;
		delete oc.nombre_empresa_facturar;
		delete oc.nombre_proveedor;
		delete oc.nombre_asignado;

		oc.fechaAprobacion = formatDate(oc.fechaAprobacion, 'yyyy-MM-dd HH:MM:SS', 'en');
		oc.fechaRequerida = formatDate(oc.fechaRequerida, 'yyyy-MM-dd HH:MM:SS', 'en');
		oc.fecha_tasa_usd = formatDate(oc.fecha_tasa_usd, 'yyyy-MM-dd HH:MM:SS', 'en');

		return oc;
	}

	async onRowEditSave(oc: OrdenCompra) {
		let detallesOC = [... await this.srvOc.getDetallesPorOC(oc.idComprasOC).toPromise()];
		let tasaAnterior: number = oc.tasa_usd;
		let nuevoTotalbs: number = 0.0;
		// console.log(detallesOC);
		// console.log(`tasa`, oc.tasa_usd);
		detallesOC.forEach(async (deta) => {
			deta.precio = deta.precio_usd * oc.tasa_usd;
			deta.precio_neto = +deta.precio * deta.cant_encontrada;
			deta.subtotal = ((+deta.tasa_iva / 100) * +deta.precio_neto) + +deta.precio_neto;
			nuevoTotalbs += deta.subtotal;
			// console.log(`nuevo detalle`, deta);
			await this.svrOcDetalles.updateSegunTasa(deta.idOcDetalle, { precio: deta.precio, subtotal: deta.subtotal }).toPromise();
		});
		oc.idEstado = EstadosOC.MODIFICADO;
		oc.estadoActual = "MODIFICADO";
		oc.monto_total = nuevoTotalbs;
		oc = { ... this.acondicianarOc(oc) };

		await this.srvOc.updateOc(oc.idComprasOC, oc).toPromise();

		let newtrazaOC: TrazaOc = {};
		newtrazaOC.idEstadoOC = EstadosOC.MODIFICADO;
		newtrazaOC.estadoActual = "MODIFICADO";
		newtrazaOC.estadoAnterior = "APROBADO";
		newtrazaOC.justificacion = `MODIFICACION DE LA TASA por parte de: ${this.idUsuario} , tasa anterior: ${tasaAnterior}`;
		await this.svrTrazaOC.insertTrazaOc(newtrazaOC).toPromise();

		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Modifiación y actualización realizada correctamente' });
		this.cargardata();
	}

	async reaprobar(oc: OrdenCompra) {
		// console.log(oc);

		this.confirmationService.confirm({
			message: `¿Esta seguro de Aprobar la O.C. nro: ${oc.idComprasOC}?`,
			accept: async () => {
				oc.idEstado = EstadosOC.APROBADO;
				oc.estadoActual = "APROBADO";
				oc = { ... this.acondicianarOc(oc) };

				await this.srvOc.updateOc(oc.idComprasOC, oc).toPromise();

				let newtrazaOC: TrazaOc = {};
				newtrazaOC.idEstadoOC = EstadosOC.MODIFICADO;
				newtrazaOC.estadoActual = "APROBADO"; //"MODIFICADO";
				newtrazaOC.estadoAnterior = "MODIFICADO";
				newtrazaOC.justificacion = `Reaprobación de la OC, por modificacion de la tasa de cambio`;
				await this.svrTrazaOC.insertTrazaOc(newtrazaOC).toPromise();

				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Reaprobación realizada correctamente' });
				this.cargardata();
			}
		});
	}

	verFormMod(oc: OrdenCompra) {
		this.tituloHeader = `Modificar la O.C. nro.: ${oc.idComprasOC}`;
		this.displayForm = true;
		this.ocSelected = { ...oc };
	}

	cerrarOcForm(mensaje: any) {
		this.displayForm = false;
		this.tituloHeader = ``;
		if (mensaje === "registrado") {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'OC modificada correctamente' });
			this.cargardata();
		}
	}

	pdf(oc: OrdenCompra) {

	}

}
