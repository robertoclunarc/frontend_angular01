
import { OrdenCompraDetalleService } from './../../services/orden-compra-detalle.service';
import { OrdenCompraService } from './../../services/orden-compra.service';
import { SolpedDetalleModelo } from './../../models/solped-detalle';
import { detalleOcModelo } from './../../models/oc-Detalle';
import { OrdenCompra, EstadosOC } from './../../models/orden-compra';
import { Component, OnInit } from '@angular/core';
import { SolPedService } from 'src/app/services/sol-ped.service';
import { SolpedModelo, estadosSolped } from 'src/app/models/solped';
import { SolPedDetalleService } from 'src/app/services/sol-ped-detalle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models';
import { UserService } from 'src/app/services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TrazaSolpedService } from 'src/app/services/traza-solped.service';
import { TrazasSolped } from 'src/app/models/trazas-solped';
import { formatDate } from '@angular/common';



@Component({
	selector: 'app-aprobar-solped',
	templateUrl: './aprobar-solped.component.html',
	styleUrls: ['./aprobar-solped.component.scss'],
	providers: [MessageService, ConfirmationService]
})
export class AprobarSolpedComponent implements OnInit {

	solpeds: SolpedModelo[] = [];
	solpedsTotales: [] = [];

	rolAprobarSOLPED = 'ROL-APROBAR-SOLPED'; //Rol para que sea o no visible el boton de asignación de una orden de compra
	rolModOC = 'ROL-MOD-OC'; //Rol para que sea o no visible el boton de asignación de una orden de compra

	solped: SolpedModelo = {};

	idGerencia: number = -1;
	idUsuario: number = -1;
	userAsignado: User = {};
	trabs_gerencia: User[] = [];

	idSolpedCompras: number = -1;

	mostrarDialogo: boolean = false;

	aprobarSolped = null;

	observacionesPresi: string = "";

	// private readonly estados = { "OC": 13, "enproceso": 6, "preorden": 7, "cerrado": 11, "enpresidencia": 12, "aprobPresidencia": 14 };
	private readonly estadoDetalles = { "proceso": 0, "aprobado": 1, "anulado": 2 };

	listDetalles: SolpedDetalleModelo[] = [];

	constructor(private svrSolped: SolPedService, private svrDetallesSolped: SolPedDetalleService, private svrTrazasSolped: TrazaSolpedService,
		private svrUser: UserService, private svrOc: OrdenCompraService, private svrOcDetalle: OrdenCompraDetalleService,
		private messageService: MessageService, private confirmationService: ConfirmationService,
		private route: ActivatedRoute, private router: Router) { }


	ngOnInit() {
		this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
		this.idUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
		this.aprobarSolped = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.rolAprobarSOLPED)) != null ? true : false);

		/* 	this.svrSolped.solped$.subscribe((data) => {
			   this.idSolpedCompras = data.idSolpedCompras;
			   //console.log("subs ",data.idSolpedCompras )
		   })  */
		//    console.log(estadosSolped[estadosSolped.preorden].toString);
		this.cargardata();
	}

	async cargardata() {
		this.solpeds = await this.svrSolped.getMisSolPedsPresindencia(); //this.svrSolped.getTodosP();
		this.solpeds.forEach((sol) => sol.observacionesPresi = "");
		/* this.solpeds.forEach(async sol => {
			this.svrSolped.getDataObsverver(sol.idSolpedCompras);
			//this.svrSolped.solped$.pipe(map(data=>console.log(data))).subscribe((result)=>console.log("result: ", result));
		}); */

	}


	async generarOCs(solped: SolpedModelo) {
		console.log("Genero Unos");

		let newOC: OrdenCompra = {};
		let proveedores: number[] = [];
		// let detallesSolped: SolpedDetalleModelo[] = [... this.listDetalles.filter((detalle) => +detalle.idSolpedCompras === +solped.idSolpedCompras
		// && detalle.opcion_aprobar === this.estadoDetalles.aprobado)];
		const detallesSolped: SolpedDetalleModelo[] = this.solpeds[this.solpeds.indexOf(solped)].detalles.filter((detalle) =>
			// +detalle.idSolpedCompras === +solped.idSolpedCompras &&
			detalle.opcion_aprobar === this.estadoDetalles.aprobado);
		for (const solped of detallesSolped) {
			proveedores.push(solped.idProveedor)
		}

		proveedores = [...new Set(proveedores)];

		for (const provee of proveedores) {
			let detSolpedFiltrados: SolpedDetalleModelo[] = detallesSolped.filter((det) => det.idProveedor === provee);

			newOC.idProveedor = provee;
			newOC.IdComprasEmpresa = solped.idEmpresa;
			newOC.idAdmActivo = solped.idAdmActivo;
			newOC.idSolpedCompras = solped.idSolpedCompras;
			newOC.idConfigGerencia = solped.idConfigGerencia;
			newOC.observaciones = detSolpedFiltrados[0].justificacion;
			newOC.idUsuarioAprobo = this.idUsuario;
			newOC.fechaAprobacion = formatDate(new Date(), 'yyyy-MM-dd', 'en');
			// newOC.observaciones += detSolpedFiltrados[0].notas ? '. ' + detSolpedFiltrados[0].notas : '';
			// console.log(this.observacionesPresi);
			newOC.observaciones += ' ' + solped.observacionesPresi;
			newOC.tasa_usd = solped.tasa_usd;
			newOC.fecha_tasa_usd = formatDate(solped.fecha_tasa_usd, 'yyyy-MM-dd hh:mm:ss', 'en');//solped.fecha_tasa_usd;
			newOC.idEstado = +EstadosOC.APROBADO;
			newOC.estadoActual = "APROBADO"; //EstadosOC[EstadosOC.APROBADO];
			newOC.justificacion = solped.descripcion;
			newOC.fechaRequerida = formatDate(solped.fechaRequerida, 'yyyy-MM-dd hh:mm:ss', 'en');
			newOC.condiciones = solped.condiciones;
			newOC.formas_envio = solped.formas_envio;
			newOC.idSegUsuario = solped.idSegUsuario;

			// newOC.monto_total = solped.monto_total;
			newOC.monto_total = 0;
			// newOC.monto_total_usd = solped.monto_total_usd;
			newOC.monto_total_usd = 0;

			let result = await this.svrOc.insertOC(newOC).toPromise();

			//newOC.idComprasOC = result["insertId"];

			let newDet: detalleOcModelo = {};
			for (const detSol of detSolpedFiltrados) {
				newDet.idComprasOC = result["insertId"];

				newDet.codigo = detSol.codigo;
				newDet.descripcion = detSol.descripcion;
				newDet.nombre = detSol.nombre;
				newDet.precio = detSol.precio;
				newDet.precio_usd = detSol.precio_usd;
				newDet.precio_usd_sutotal = detSol.precio_usd_sutotal;
				newDet.cantidad = detSol.cantidad;
				newDet.cant_encontrada = detSol.cant_encontrada;
				newDet.unidadMedidaC = detSol.unidadMedidaC;

				newDet.IdComprasEmpresa = detSol.IdComprasEmpresa;
				newDet.idAdmActivo = solped.idAdmActivo;
				newDet.idProveedor = detSol.idProveedor;
				newDet.justificacion = detSol.justificacion;
				newDet.notas = detSol.notas;
				newDet.subtotal = +detSol.subtotal;

				newOC.monto_total += +newDet.subtotal;
				newOC.monto_total_usd += +newDet.precio_usd_sutotal;

				await this.svrOcDetalle.insertDetOc(newDet).toPromise();

				detSol.estado = this.estadoDetalles.aprobado;
				await this.svrDetallesSolped.updateDetSolped(detSol);
			}

			await this.svrOc.updateMontoTotalOc(newOC.idComprasOC, {
				idComprasOC: result["insertId"], monto_total: newOC.monto_total,
				monto_total_usd: newOC.monto_total_usd, tasa_usd: newOC.tasa_usd,
				fecha_tasa_usd: formatDate(Date.now(), "yyyy-MM-dd h:mm:ss", "en")
			}).toPromise();

		}
		this.cargardata();
	}

	async aprobarSolpedC(solped: SolpedModelo) {
		console.log("Aprobo TODA!!!");
		/* 	this.generarOCs(solped);
			return false; */
		await this.svrSolped.cambiarFase({
			idSolpedCompras: solped.idSolpedCompras,
			idEstadoActual: estadosSolped.OC, //this.estados.aprobPresidencia,
			estadoActual: estadosSolped[estadosSolped.OC].toString().toUpperCase()
		});

		let newtraza: TrazasSolped = {
			justificacion: "Presidencia Aprobo! " + solped.observacionesPresi,
			idSegUsuario: this.idUsuario,
			idSolpedCompras: solped.idSolpedCompras
		};
		await this.svrTrazasSolped.insertTraza(newtraza);

		//this.generarOCs(solped);
		//this.messageService.clear();
		// this.messageService.add({ key: 'tc', severity: 'success', summary: 'Generada(s) las O.C.(s) correspondientes' });
		// this.cargardata();
	}

	async revisar(solped: SolpedModelo, detallesRevisar: SolpedDetalleModelo[] = []) {

		// console.log("Reviso uuno");
		// return false;

		// this.confirmationService.confirm({
		// 	message: `¿Esta seguro de mandar a revisión la Solicitud nro. : ${solped.idSolpedCompras}?`,
		// 	accept: async () => {
		if (detallesRevisar.length > 0) {
			for (const det of detallesRevisar) {
				await this.svrDetallesSolped.updateDet(det.idDetalleSolped,
					{
						idDetalleSolped: det.idDetalleSolped,
						codigo: det.codigo,
						idSolpedCompras: det.idSolpedCompras,
						cantidad: det.cant_encontrada
					}
				).toPromise();
			}
		}
		await this.svrSolped.cambiarFase({
			idSolpedCompras: solped.idSolpedCompras,
			idEstadoActual: estadosSolped.preorden, //this.estados.preorden,
			estadoActual: estadosSolped[estadosSolped.preorden].toString().toUpperCase() //Object.keys(estadosSolped)[2]
		});

		let newtraza: TrazasSolped = {
			justificacion: "Presidencia manda a revisión la SOLPED " + solped.observacionesPresi,
			idSegUsuario: this.idUsuario,
			idSolpedCompras: solped.idSolpedCompras
		};
		await this.svrTrazasSolped.insertTraza(newtraza);

		this.cargardata();

		// let newTrazaTicket: TrazaTicketServicio = {
		// 	idTicketServicio: this.solped.idTicketServicio,
		// 	justificacion: `Anulación del producto: ${detalleSoPed.codigo} en solped: ${this.solped.idSolpedCompras}`,
		// 	idEstadoTicket: this.estadoAprobadoTicket.id,
		// 	estadoAnterior: this.estadoAprobadoTicket.nombre,
		// 	idSegUsuario: this.idUsuario
		// }

		// this.messageService.clear();
		// this.messageService.add({ key: 'tc', severity: 'success', summary: 'Solped Enviada a revisión' });
		// this.cargardata();
		// }
		// });
	}

	async anularDetalles(solped: SolpedModelo) {

		// await this.svrSolped.cambiarFase({
		// 	idSolpedCompras: solped.idSolpedCompras,
		// 	idEstadoActual: this.estados.preorden,
		// 	estadoActual: Object.keys(this.estados)[2]
		// });
		// let detallesSolped: SolpedDetalleModelo[] = [... this.listDetalles.filter((detalle) => +detalle.idSolpedCompras === +solped.idSolpedCompras
		// 	&& detalle.opcion_aprobar === this.estadoDetalles.anulado)];
		const detallesSolped: SolpedDetalleModelo[] = [... this.solpeds[this.solpeds.indexOf(solped)].detalles.filter((detalle) =>
			// +detalle.idSolpedCompras === +solped.idSolpedCompras && 
			+detalle.opcion_aprobar === +this.estadoDetalles.anulado)];

		/* console.log(detallesSolped);
		return false; */
		for (const detalleSo of detallesSolped) {
			let newtraza: TrazasSolped = {
				justificacion: `Presidencia anula el producto: ${detalleSo.codigo}` + (this.observacionesPresi !== "" ? this.observacionesPresi : ""),
				idSegUsuario: this.idUsuario,
				idSolpedCompras: solped.idSolpedCompras
			};
			await this.svrTrazasSolped.insertTraza(newtraza);

			detalleSo.estado = this.estadoDetalles.anulado;
			await this.svrDetallesSolped.updateDetSolped(detalleSo);
		}
		// this.messageService.clear();
		// this.messageService.add({ key: 'tc', severity: 'success', summary: 'Solped Enviada a revisión' });
		this.cargardata();
	}

	async anularSolped(solped: SolpedDetalleModelo) {
		/* console.log("ANULO TOAAA");
		return false; */
		await this.svrSolped.cambiarFase({
			idSolpedCompras: solped.idSolpedCompras,
			idEstadoActual: estadosSolped.anulado,
			estadoActual: estadosSolped[estadosSolped.anulado].toString().toUpperCase()// Object.keys(estadosSolped)[5]
		});

		let newtraza: TrazasSolped = {
			justificacion: `Presidencia Anulo la SOLPED nro.: ${solped.idSolpedCompras}` + (this.observacionesPresi !== "" ? this.observacionesPresi : ""),
			idSegUsuario: this.idUsuario,
			idSolpedCompras: solped.idSolpedCompras
		};
		await this.svrTrazasSolped.insertTraza(newtraza);
	}

	async procesar(solped: SolpedModelo) {
		// console.log(solped);
		// console.log(this.listDetalles);
		this.confirmationService.confirm({
			message: "¿Esta seguro de procesar esta Solped?",
			accept: () => {
				let detallesSol: SolpedDetalleModelo[] = this.solpeds[this.solpeds.indexOf(solped)].detalles;
				let totalDetalles: number = detallesSol.length;
				let totalRevisar: number = detallesSol.filter((det) => +det.opcion_aprobar === +this.estadoDetalles.proceso).length;
				let totalAprobar: number = detallesSol.filter((det) => +det.opcion_aprobar === +this.estadoDetalles.aprobado).length;
				let totalAnular: number = detallesSol.filter((det) => +det.opcion_aprobar === +this.estadoDetalles.anulado).length;

				totalRevisar > 0 && this.revisar(solped, detallesSol.filter((det) => +det.opcion_aprobar === +this.estadoDetalles.proceso));
				totalAprobar > 0 && this.generarOCs(solped);
				totalAnular > 0 && this.anularDetalles(solped);

				(totalRevisar === 0 && totalAprobar > 0) && this.aprobarSolpedC(solped);
				(totalAnular === totalDetalles) && this.anularSolped(solped);

				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Proceso realizado con exito!' });
			}
		});

		//this.cargardata();

	}

	getDetalleMod(detMod: SolpedDetalleModelo) {
		// this.listDetalles.push(event);
		// this.listDetalles = [... new Set(this.listDetalles)];
		// this.solpeds.filter((sol)=>sol.idSolpedCompras === detMod.idSolpedCompras)
		// console.log(this.solpeds.indexOf(this.solpeds.filter((sol)=>sol.idSolpedCompras === detMod.idSolpedCompras)[0]));
		this.solpeds[this.solpeds.indexOf(this.solpeds.filter((sol) => sol.idSolpedCompras === detMod.idSolpedCompras)[0])]
			.detalles.filter((det) => det.idDetalleSolped === detMod.idDetalleSolped)[0].opcion_aprobar = Number(detMod.opcion_aprobar);
		/* 	this.listDetalles = [... this.listDetalles.map((detalle) => {
			if (detalle.idDetalleSolped === detMod.idDetalleSolped) {
				detalle.opcion_aprobar = +detMod.opcion_aprobar;
			}
			return detalle;
		})]; */
		// console.log(this.solpeds);
	}

	llenarListadoDetalle(listado: SolpedDetalleModelo[]) {
		//this.listDetalles = [...listado];
		// console.log(this.solpeds.indexOf({idSolpedCompras : listado[0].idSolpedCompras})); 
		this.solpeds.forEach((sol) => {
			if (sol.idSolpedCompras === listado[0].idSolpedCompras) {
				sol.detalles = listado;
			}
		});
		// console.log(this.solpeds);
	}

	getTotalDetallesAct(event: any) {
		//console.log(event);
		/* console.log(this.solpeds.filter((solped) => solped.idSolpedCompras === event.idSolpedCompras).map((sol, i, actual) => {
			sol.totDetallesNoProc = event.total;
			return sol;
		})); */
		//console.log("Nuevos Solped", this.solpeds); 


	}

}
