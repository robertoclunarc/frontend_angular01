import { SolpedModelo, estadosSolped } from './../../models/solped';
import { Component, OnInit } from '@angular/core';
import { SolPedService } from 'src/app/services/sol-ped.service';
import { SolPedDetalleService } from 'src/app/services/sol-ped-detalle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models';
import { UserService } from 'src/app/services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TrazaSolpedService } from 'src/app/services/traza-solped.service';
import { TrazasSolped } from 'src/app/models/trazas-solped';
import { OrdenCompra } from 'src/app/models/orden-compra';
import { SolpedDetalleModelo } from 'src/app/models/solped-detalle';
import { formatDate } from '@angular/common';
import { detalleOcModelo } from 'src/app/models/oc-Detalle';
import { OrdenCompraDetalleService } from 'src/app/services/orden-compra-detalle.service';
import { OrdenCompraService } from 'src/app/services/orden-compra.service';


@Component({
	selector: 'app-solped-oc',
	templateUrl: './solped-oc.component.html',
	styleUrls: ['./solped-oc.component.scss'],
	providers: [ConfirmationService, MessageService]
})
export class SolpedOCComponent implements OnInit {

	solpeds: SolpedModelo[] = [];

	private estadoAsignado = { nro: 5, nombre: "Asignado" };

	rolAsignarOC = 'ROL-ASIG-OC'; //Rol para que sea o no visible el boton de asignación de una orden de compra

	solped: SolpedModelo = {};

	idGerencia: number = -1;
	idUsuario: number = -1;
	userAsignado: User = {};
	trabs_gerencia: User[] = [];

	mostrarDialogo: boolean = false;
	modTasaD: boolean = false;
	verAsignar: boolean = false;
	mostrarTodo: boolean = false;

	newOCgenerada: number = -1;
	solpedToMod: SolpedModelo = {};

	// private estados = { "OC": 13, "enproceso": 6, "preorden": 7, "cerrado": 11, "enpresidencia": 12, "aprobPresidencia": 14 };

	constructor(private svrSolped: SolPedService, private svrDetalles: SolPedDetalleService, private svrTrazasSolped: TrazaSolpedService,
		private svrUser: UserService, private svrOcDetalle: OrdenCompraDetalleService, private svrOc: OrdenCompraService,
		private messageService: MessageService, private route: ActivatedRoute, private router: Router, private confirmationService: ConfirmationService,) { }


	ngOnInit() {
		this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
		this.idUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
		this.verAsignar = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.rolAsignarOC)) != null ? true : false);
		this.mostrarTodo = this.verAsignar;


		this.cargardata();
		//this.solped_detalles = await this.svrDetalles.
	}

	async cargardata() {
		this.solpeds = await (this.mostrarTodo ? this.svrSolped.getTodosP() : this.svrSolped.getMisSolPeds(this.idUsuario)); //this.svrSolped.getTodosP();

	}

	mostrarAsignacion(solped: SolpedModelo) {
		this.userAsignado = {};
		this.solped = solped;
		this.svrUser.getPorGerencias(this.idGerencia).then((data) => {
			this.trabs_gerencia = data;
			//console.log("Busco: ", this.trabs_gerencia);
			this.mostrarDialogo = true;
			/* if (solped.idSegUsuario) {
				this.userAsignado.idSegUsuario = solped.idSegUsuario;
			} */

		});
	}

	async asignar(solped: SolpedModelo) {
		//console.log("asignado: ", this.userAsignado);
		//return false;
		if (!this.userAsignado) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Seleccione un usuario' });
			return false;
		}

		this.solped.estadoActual = this.estadoAsignado.nombre;
		this.solped.idEstadoActual = this.estadoAsignado.nro;
		this.solped.idSegUsuario = this.userAsignado.idSegUsuario;		//
		await this.svrSolped.asignarSolped(this.solped);


		this.solped.nombre_asignado = this.userAsignado.nombre_completo;

		const newtraza: TrazasSolped = {
			justificacion: "Asignado a usuario: " + this.userAsignado.nombre_completo,
			idSegUsuario: this.idUsuario,
			idEstadoSolped: estadosSolped.asignado, // this.estadoAsignado.nro,  // estado asignado
			estadoActual: this.estadoAsignado.nombre,
			estadoAnterior: Object.keys(estadosSolped.asignado)[0],
			idSolpedCompras: this.solped.idSolpedCompras
		};
		await this.svrTrazasSolped.insertTraza(newtraza);


		//this.cargardata();
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Asignación Satisfactoria' });
		this.cerrarDialogo();
		this.userAsignado = {};

	}

	fases(solped: SolpedModelo) {
		this.router.navigate(["fases-solped", solped.idSolpedCompras]);
	}

	confirmarGenrarOC(solped: SolpedModelo) {
		this.confirmationService.confirm({
			message: `¿Seguro desea generar la Orden de Compra para la Solped nro: ${solped.idSolpedCompras}?.
						 ATENCIÓN: Después de esta acción no podrá realizar ningun cambios`,
			accept: async () => {
				await this.generarOC(solped);

				await this.svrSolped.cambiarFase({
					idSolpedCompras: solped.idSolpedCompras,
					idEstadoActual: estadosSolped.OC, //this.estados.OC,
					estadoActual: "O.C."
				});

				let newtraza: TrazasSolped = {
					justificacion: "Generada la OC.",
					idSegUsuario: this.idUsuario,
					idSolpedCompras: solped.idSolpedCompras
				};
				await this.svrTrazasSolped.insertTraza(newtraza);

				await this.svrSolped.updateFechaAprobacionSolped(solped).toPromise();

				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: `Nueva O.C. generadada nro: ${this.newOCgenerada}` });

				this.cargardata();
			}
		});
	}


	async generarOC(solped: SolpedModelo) {
		let newOC: OrdenCompra = {};
		let proveedores: number[] = [];
		let detallesSolped: SolpedDetalleModelo[] = [...await this.svrSolped.getDetallesPorSolPed(solped.idSolpedCompras).toPromise()];
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
			newOC.monto_total = solped.monto_total;
			newOC.idUsuarioAprobo = this.idUsuario;
			newOC.fechaAprobacion = formatDate(new Date(), 'yyyy-MM-dd hh:mm', 'en');
			newOC.monto_total_usd = solped.monto_total_usd;
			newOC.tasa_usd = solped.tasa_usd;
			newOC.fecha_tasa_usd = formatDate(solped.fecha_tasa_usd, "yyyy-MM-dd hh:mm", "en");
			//console.log("New OC", newOC);
			let result = await this.svrOc.insertOC(newOC).toPromise();
			this.newOCgenerada = result["insertId"];

			let newDet: detalleOcModelo = {};
			for (const detSol of detSolpedFiltrados) {
				newDet.idComprasOC = result["insertId"];

				newDet.codigo = detSol.codigo;
				newDet.descripcion = detSol.descripcion;
				newDet.nombre = detSol.nombre;
				newDet.precio = detSol.precio;
				newDet.cantidad = detSol.cantidad;
				newDet.cant_encontrada = detSol.cant_encontrada;

				newDet.IdComprasEmpresa = detSol.IdComprasEmpresa;
				newDet.idAdmActivo = solped.idAdmActivo;
				newDet.idProveedor = detSol.idProveedor;
				newDet.justificacion = detSol.justificacion;
				newDet.notas = detSol.notas;
				newDet.subtotal = detSol.subtotal;
				//console.log("New DEtalle OC", newDet);
				await this.svrOcDetalle.insertDetOc(newDet).toPromise();

			}
			newOC = {};

		}

	}

	modTasa(solped: SolpedModelo) {
		this.modTasaD = true;
		this.solpedToMod = solped;

	}

	async recalcularTasa(){

		/* await this.svrSolped.updateMontoTotal({
			idSolpedCompras: this.solpedToMod.idSolpedCompras, monto_total: this.solpedToMod.monto_total,
			monto_total_usd: this.monto_total_usd, tasa_usd: this.solped.tasa_usd,
			fecha_tasa_usd: formatDate(Date.now(), "yyyy-MM-dd h:mm:ss", "en")
		}).toPromise(); */
		this.cerrarDialogo();
	}

	cerrarDialogo() {
		this.mostrarDialogo = false;
		this.modTasaD = false;
		this.userAsignado = {};
		this.solpedToMod = {};
	}

}
