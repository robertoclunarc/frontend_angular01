import { EmpresacomprasService } from 'src/app/services/empresacompras.service';
import { EmpresaCompras } from './../../models/empresa-compras';
import { formatDate } from '@angular/common';
// import { detalleOcModelo } from 'src/app/models/oc-Detalle';
import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TrazasSolped } from 'src/app/models/trazas-solped';
import { TrazaSolpedService } from 'src/app/services/traza-solped.service';
import { TsTrazaTrazaService } from 'src/app/services/ts-traza-ticket.service';
import { ProveedoresComprasService } from "../../services/proveedores-compras.service"
import { FasesSolped } from "../../models/fases-solped";
import { SolPedService } from 'src/app/services/sol-ped.service';
import { SolpedModelo, estadosSolped } from 'src/app/models/solped';
import { EstadosSolpedModelo } from 'src/app/models/estados-solped';
import { EstadosSolpepService } from 'src/app/services/estados-solpep.service';
import { ProveedorModelo } from 'src/app/models/proveedor-modelo';
import { SolPedDetalleService } from 'src/app/services/sol-ped-detalle.service';
import { SolpedDetalleModelo } from 'src/app/models/solped-detalle';
import { TrazaTicketServicio } from 'src/app/models/traza-ticket-servicio';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
	selector: 'app-fases-solped',
	templateUrl: './fases-solped.component.html',
	providers: [MessageService, ConfirmationService],
	styleUrls: ['./fases-solped.component.scss'],
	encapsulation: ViewEncapsulation.None, //Lo necesitaba para mostrar el componente "steps" de primeng distrbuido en la pantalla
	animations: [
		trigger('rowExpansionTrigger', [
			state('void', style({
				transform: 'translateX(-10%)',
				opacity: 0
			})),
			state('active', style({
				transform: 'translateX(0)',
				opacity: 1
			})),
			transition('* <=> *', animate('100ms cubic-bezier(0.86, 0, 0.07, 1)'))
		])
	],
})
export class FasesSolpedComponent implements OnInit {

	idSolpedCompras: number = -1;
	pasos: MenuItem[];
	colsPreOC: any[];
	activeIndex: number = 0;
	idGerencia: number = -1;
	idUsuario: number = -1;
	verAsignar: boolean = false;
	disPreCompra: boolean = false;
	lockFases: boolean = false;

	vieneAnterior: number = -1;
	monto_total: number = 0;
	monto_total_usd: number = 0;
	tasa_usd: number = 1.0;

	observacion: string = "";
	rolAsignarOC = 'ROL-ASIG-OC';

	solped: SolpedModelo = {};
	estadosSolped: EstadosSolpedModelo[] = [];
	proveedores: ProveedorModelo[] = [];
	detallePreOC: SolpedDetalleModelo[] = [];
	proveedorSelect: ProveedorModelo = {};
	detalleSolpedNota: SolpedDetalleModelo = {};

	cantEncontrada: HTMLElement;
	botonDesagregar: ElementRef;

	altoTabla: string = "";

	estadoAprobadoTicket = { id: 4, nombre: "Aprobado" };

	// private readonly estados = { "asignado": 5, "enproceso": 6, "preorden": 7, "cerrado": 11, "enpresidencia": 12, "anulado": 15 };

	private readonly estadosDetalle = { "proceso": 0, "aprobado": 1, "anulado": 2 };

	displayDialogoDet: boolean = false;
	tituloInsert: string;

	empresasAFacturar: EmpresaCompras[] = [];
	empreSelected: EmpresaCompras = {};

	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

	constructor(private route: ActivatedRoute, private router: Router,
		private svrTrazasSolped: TrazaSolpedService, private svrSolped: SolPedService,
		private svrEstadoSolped: EstadosSolpepService, private svrDetallesSol: SolPedDetalleService,
		private messageService: MessageService, private svrProveedores: ProveedoresComprasService, private confirmationService: ConfirmationService,
		private svrTicketTraza: TsTrazaTrazaService, private svrEmpresas: EmpresacomprasService, private svrNotificaciones: NotificacionesService,
		private renderer: Renderer2) {


	}
	// async ngOnChanges() {
	// 	//await this.svrSolped.getDataObsverver(this.idSolpedCompras);
	// }

	cargarDataDetalle() {
		this.svrDetallesSol.getDetalleDetSolpedP(this.idSolpedCompras).then((data) => {
			data.map((detalle) => {
				detalle.tipo = "Original";
				detalle.tasa_iva = !(detalle.tasa_iva) ? 16.00 : detalle.tasa_iva;
				detalle.precio_neto = !(detalle.precio_neto) ? 0.0 : detalle.precio_neto;
				//this.monto_total += detalle.precio_neto;
				detalle.estado = 0;
				return detalle;
			});
			this.detallePreOC = data;
		});
	}

	async ngOnInit() {
		this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
		this.idUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
		this.idSolpedCompras = Number.parseInt(this.route.snapshot.paramMap.get("idSolpedCompras"));
		this.verAsignar = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.rolAsignarOC)) != null ? true : false);


		await this.svrSolped.getDataObsverver(this.idSolpedCompras);
		await this.svrTrazasSolped.notificarCambio(this.idSolpedCompras);

		this.estadosSolped = await this.svrEstadoSolped.getAll();

		this.cargarDataDetalle();

		///Para actualizar el componente SolpedOne
		this.svrSolped.solped$.subscribe((data) => {
			this.solped = data;
			// console.log(this.solped);

		});

		switch (this.solped.idEstadoActual) {
			case 5:
				this.activeIndex = 0;
				break;
			/* case 6:
				this.activeIndex = 1;
				break; */
			case 7:
				this.activeIndex = 1;
				break;
			case 11:
				this.activeIndex = 2;
				break;
			case 8:
				this.activeIndex = 3;
				break;

			default:
				break;
		}

		this.construirEtapas();

		this.empresasAFacturar = [... await this.svrEmpresas.getAll().toPromise()];
		this.empreSelected = (this.solped.idEmpresa) ? this.empresasAFacturar.filter((empresa) => +empresa.IdComprasEmpresa === this.solped.idEmpresa)[0] : this.empresasAFacturar[0];

		this.cargarSegunfase();

		this.colsPreOC = [
			/* { field: 'notas', header: 'Notas', witdh: "3%" }, */
			{ field: '', header: '', witdh: "1%" },
			{ field: 'nombre', header: 'Nombre', witdh: "17%" },
			//{ field: 'fechaRequerida', header: 'Fecha Req', witdh: "5%" },
			//	{ field: 'nombre_activo', header: 'Proposito', witdh: "10%" },
			{ field: 'cantidad', header: 'Cant S.', witdh: "6%" },
			{ field: 'cant_encontrada', header: 'Encon.', witdh: "3%" },
			{ field: 'idProveeor', header: 'Provee', witdh: "18%" },
			{ field: 'precio', header: 'Precio X Uni. (BsS)', witdh: "10%" },
			{ field: 'iva_tasa_f', header: '% IVA', witdh: "5%" },
			//{ field: 'precio_iva_f', header: 'Pr. + IVA', witdh: "10%" },
			{ field: 'subtotal', header: 'Sub-total', witdh: "10%" },

		];
	}

	construirEtapas() {

		this.pasos = [
			{
				label: "Asignado",
				command: (event: any) => {
					this.activeIndex = 0;
					this.cambiarFase();
					this.disPreCompra = false;
				}
			},
			/* 	{
					label: "En proceso",
					command: (event: any) => {
						this.activeIndex = 1;
						this.cambiarFase();
						this.disPreCompra = false;
					}
				}, */
			{
				label: "PreOrden",
				command: (event: any) => {
					this.activeIndex = 1;
					this.cambiarFase();
					this.disPreCompra = false;
					this.vieneAnterior = 1;
				}
			},
			{
				label: "Cerrada PreOC",
				command: (event: any) => {
					this.activeIndex = 2;
					this.cambiarFase();
					this.disPreCompra = true;
					this.vieneAnterior = 1;
				}
			},
			/* {
				label: "A Presidencia",
				command: (event: any) => {
					this.activeIndex = 4
					this.cambiarFase();
					this.disPreCompra = true;
				}
			} */
		];

		this.lockFases = ((this.solped.idEstadoActual == estadosSolped.cerrado) && (!this.verAsignar))
		/* console.log("Actual:", this.solped.idEstadoActual); */
		if (/* (this.solped.idEstadoActual == this.estados.cerrado) && */ (this.verAsignar)) {
			this.pasos.push({
				label: "A Presidencia",
				command: (event: any) => {
					this.activeIndex = 3;
					this.cambiarFase();
					this.disPreCompra = true;
				}
			});
			/* console.log("Entro", this.pasos); */
		}

		//this.pasos = [];
	}

	async cargarSegunfase() {
		let idEstadoActual = -1;
		let estadoActual = "";
		this.vieneAnterior = 0;

		// console.log(this.solped.tasa_usd);
		this.monto_total = (this.solped.monto_total && this.solped.monto_total !== 0) ? this.solped.monto_total : 0;
		this.monto_total_usd = (this.solped.monto_total_usd && this.solped.monto_total_usd !== 0) ? this.solped.monto_total_usd : 0;
		// this.tasa_usd = (this.solped.tasa_usd && this.solped.tasa_usd !== 0) ? this.solped.tasa_usd : 1.0;
		this.solped.tasa_usd = this.solped.tasa_usd && this.solped.tasa_usd !== null && this.solped.tasa_usd !== 0 ? this.solped.tasa_usd : 1.0;
		// this.solped.tasa_usd = 1.0;
		this.disPreCompra = false;

		switch (this.solped.idEstadoActual) {
			case 5: // Asignado				
				idEstadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.asignado }))[0].idComprasEstadosSolped; //this.estados.enproceso; 
				estadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.asignado }))[0].nombre;

				break;
			case 7: // PREORDEN			
				idEstadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.preorden }))[0].idComprasEstadosSolped; //this.estados.enproceso; 
				estadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.preorden }))[0].nombre;
				break;
			case 11: // CERRADO
				this.disPreCompra = true;
				idEstadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.cerrado }))[0].idComprasEstadosSolped; //this.estados.enproceso; 
				estadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.cerrado }))[0].nombre;
				/* for (const detalle of this.detallePreOC) {
					this.monto_total += detalle.precio_neto * detalle.cant_encontrada;
				}
				this.monto_total_usd = +this.monto_total / +this.tasa_usd; */
				break;
			default:
				break
		}
		// await this.svrSolped.getDataObsverver(this.idSolpedCompras);
		// await this.svrTrazasSolped.notificarCambio(this.idSolpedCompras);
		//this.solped.tasa_usd = 1.00;

	}

	async cambiarFase() {
		//console.log("fase ", this.activeIndex);
		let idEstadoActual = -1;
		let estadoActual = "";

		let newtraza: TrazasSolped = {
			justificacion: (this.observacion == "" || !this.observacion ? "Cambio de Fase" : this.observacion),
			idSegUsuario: this.idUsuario,
			idSolpedCompras: this.idSolpedCompras
		};

		let newTrazaTicket: TrazaTicketServicio = {
			idTicketServicio: this.solped.idTicketServicio,
			justificacion: "Cambio de fase en SOLPED nro " + this.solped.idSolpedCompras,
			idEstadoTicket: this.estadoAprobadoTicket.id,
			estadoAnterior: this.estadoAprobadoTicket.nombre,
			idSegUsuario: this.idUsuario
		}

		switch (this.activeIndex) {
			case FasesSolped.asignada:
				//if (this.vieneAnterior == 1) {
				idEstadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.asignado }))[0].idComprasEstadosSolped; //this.estados.enproceso; 5;
				estadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.asignado }))[0].nombre;//"Asignado";
				newtraza.idEstadoSolped = idEstadoActual;
				newtraza.estadoActual = estadoActual
				newtraza.estadoAnterior = "Aprobado";
				this.solped.idEstadoActual = idEstadoActual;
				//}
				await this.svrSolped.cambiarFase({ idSolpedCompras: this.solped.idSolpedCompras, idEstadoActual: idEstadoActual, estadoActual: estadoActual });
				break;
			case 1: // PREORDEN
				this.vieneAnterior = 1;
				this.monto_total = 0;
				idEstadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.preorden }))[0].idComprasEstadosSolped; //this.estados.enproceso; 
				estadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.preorden }))[0].nombre;
				newtraza.idEstadoSolped = idEstadoActual;
				newtraza.estadoActual = estadoActual;
				newtraza.estadoAnterior = "En Proceso";
				this.solped.idEstadoActual = idEstadoActual; //7;//CAMBIARRRRRRR
				this.proveedores = await this.svrProveedores.getAll();

				//await this.svrTrazasSolped.insertTraza(newtraza);
				await this.svrSolped.cambiarFase({ idSolpedCompras: this.solped.idSolpedCompras, idEstadoActual: idEstadoActual, estadoActual: estadoActual });
				break;
			case 2: //Cerrado preorden
				// this.detallePreOC[0].precio = +this.solped.tasa_usd * +this.detallePreOC[0].precio_usd.valueOf();
				// console.log(this.detallePreOC);
				// return false;
				this.vieneAnterior = 1;
				this.monto_total = 0;
				this.disPreCompra = true;
				idEstadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.cerrado }))[0].idComprasEstadosSolped;
				estadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.cerrado }))[0].nombre;

				await this.svrSolped.updateSolped(this.solped.idSolpedCompras,
					{
						idEmpresa: this.empreSelected.IdComprasEmpresa,
						formas_envio: this.solped.formas_envio,
						condiciones: this.solped.condiciones
					}
				).toPromise();

				// await this.svrSolped.setEmpresaAFacturar({
				// 	idSolpedCompras: this.solped.idSolpedCompras,
				// 	idEmpresa: this.empreSelected.IdComprasEmpresa
				// }).toPromise();

				newtraza.idEstadoSolped = idEstadoActual;
				newtraza.estadoActual = estadoActual;
				newtraza.estadoAnterior = "Pre Orden OC";
				this.solped.idEstadoActual = idEstadoActual;

				//Guardar el nuevo detalle
				await this.svrSolped.eliminarDetalles(this.solped.idSolpedCompras).toPromise(); // Eliminar las que estan en la tabla 
				let newDet: SolpedDetalleModelo = {};

				await this.svrSolped.cambiarFase({ idSolpedCompras: this.solped.idSolpedCompras, idEstadoActual: idEstadoActual, estadoActual: estadoActual });
				//this.detallePreOC.forEach(async (detalle) => {
				this.monto_total_usd = 0;
				for (const detalle of this.detallePreOC) {
					newDet = { ...detalle }
					newDet.idSolpedCompras = this.solped.idSolpedCompras;
					delete newDet.idDetalleSolped;
					delete newDet.nombre_activo;
					delete newDet.nombre_empresa;
					delete newDet.nombre_proveedor;
					delete newDet.nombre_trabajo;
					delete newDet.tipo;
					// detalle.precio = +this.solped.tasa_usd * +detalle.precio_usd;
					// newDet.subtotal = ((+newDet.tasa_iva / 100) * +newDet.precio_neto) + +newDet.precio_neto;
					newDet.fechaAlta = formatDate(detalle.fechaAlta, 'yyyy-MM-dd', 'en');
					newDet.fechaRequerida = formatDate(detalle.fechaRequerida, 'yyyy-MM-dd', 'en');
					// newDet.precio_usd = +newDet.precio / +this.tasa_usd;
					newDet.precio = +this.solped.tasa_usd * newDet.precio_usd;
					newDet.precio_neto = +newDet.precio * +newDet.cant_encontrada;
					newDet.subtotal = ((+newDet.tasa_iva / 100) * +newDet.precio_neto) + +newDet.precio_neto;


					// console.log(detalle.precio_usd_sutotal);
					/* 	detalle.precio = parseFloat(formatNumber(newDet.precio, 'en-EN','1.2-2'));
						detalle.precio_neto = parseFloat(formatNumber(newDet.precio_neto, 'en-EN','1.2-2'));
						detalle.subtotal = parseFloat(formatNumber(newDet.subtotal, 'en-EN','1.2-2'));; */
					// console.log("guar", newDet.precio);

					newDet.notas = detalle.notas;
					this.monto_total += newDet.subtotal; //newDet.precio_neto * newDet.cant_encontrada;
					this.monto_total_usd += newDet.precio_usd_sutotal;
					// this.monto_total_usd += newDet.precio_usd;
					await this.svrDetallesSol.insertDetSolped(newDet).toPromise()
					//});
				}
				// console.log("monto total", this.monto_total);
				//this.monto_total_usd = +this.monto_total / +this.solped.tasa_usd;
				await this.svrSolped.updateMontoTotal({
					idSolpedCompras: this.solped.idSolpedCompras, monto_total: this.monto_total,
					monto_total_usd: this.monto_total_usd, tasa_usd: this.solped.tasa_usd,
					fecha_tasa_usd: formatDate(Date.now(), "yyyy-MM-dd h:mm:ss", "en")
				}).toPromise();

				break;

			case 3: //En presidencia
				this.confirmationService.confirm({
					message: `¿Seguro de enviar la solped nro.: ${this.idSolpedCompras} a presidencia?`,
					accept: async () => {
						// return true;
						this.vieneAnterior = 1;
						idEstadoActual = (this.estadosSolped.filter((estado) =>
							+estado.idComprasEstadosSolped === +estadosSolped.enpresidencia
						))[0].idComprasEstadosSolped; //this.estados.enproceso; 

						estadoActual = (this.estadosSolped.filter((estado) => +estado.idComprasEstadosSolped === +estadosSolped.enpresidencia
						))[0].nombre;

						newtraza.idEstadoSolped = idEstadoActual;
						newtraza.estadoActual = estadoActual;
						newtraza.estadoAnterior = "Cerrado PreOC";
						this.solped.idEstadoActual = idEstadoActual;

						//await this.svrTrazasSolped.insertTraza(newtraza);
						await this.svrSolped.cambiarFase({
							idSolpedCompras: this.solped.idSolpedCompras, idEstadoActual: idEstadoActual,
							estadoActual: estadoActual
						});

						//Envio de mensaje a usuarios que solicito
						let distintosCods: string[] = [];
						for (const solped of this.detallePreOC) {
							distintosCods.push(solped.codigo);
						}
						distintosCods = [...new Set(distintosCods)];
						for (const cod of distintosCods) {
							let detallesPorCod = this.detallePreOC.filter((detalles) => detalles.codigo === cod);
							let cant_solicitud_cod = detallesPorCod[0].cantidad;
							let totalxCods: number = await new Promise((resolve, reject) => {
								resolve(detallesPorCod.reduce((prev, cur) => {
									return prev + +cur.cant_encontrada;
								}, 0))
							});
							if (totalxCods !== cant_solicitud_cod) {
								this.svrNotificaciones.nuevaNotificacionRecibe(
									`El producto: ${cod} NO fue localizado en la cantidad que solicito. Porfavor contacte a COMPRAS`,
									this.currentUser.idSegUsuario,
									this.solped.idUsuarioRegistro,
									this.solped.idConfigGerencia
								)
									.subscribe((resp) => console.log(resp));
							}
						}

						this.volver();
					}
				});
				break;
			default:
				break;
		}

		//Traza de la SOLPED
		await this.svrTrazasSolped.insertTraza(newtraza);

		//Traza para el ticket
		newTrazaTicket.justificacion += " a " + estadoActual + " - Justificacion: " + newtraza.justificacion;
		this.svrTicketTraza.nuevoTrazaP(newTrazaTicket).then(() => { });
		//Cambio al observable
		await this.svrSolped.getDataObsverver(this.idSolpedCompras);
		await this.svrTrazasSolped.notificarCambio(this.idSolpedCompras);
		this.observacion = "";

	}

	calcularPrecioNeto(event, inputChange, detalle: SolpedDetalleModelo) {
		if (event.target.value) {
			let valPrecio: number = detalle.precio//parseFloat(event.target.value); //+iprecio.getAttribute("ng-reflect-model"); //+iprecio.getAttribute("ng-reflect-model"); //aria-valuenow

			let itasa: number = detalle.tasa_iva//document.getElementById('tasa' + inputChange) as HTMLInputElement;
			let valTasa: number = itasa / 100;
			//console.log(valTasa);
			detalle.precio_neto = +detalle.cant_encontrada * valPrecio;
			detalle.precio_usd = (valPrecio / +this.solped.tasa_usd);
			detalle.subtotal = (+valPrecio * +detalle.cant_encontrada) + (+valTasa * ((valPrecio * +detalle.cant_encontrada)));
			//console.log(detalle.precio, detalle.precio_usd, detalle.subtotal);
			// detalle.precio_usd_sutotal = (valPrecio / +this.solped.tasa_usd) * +detalle.cant_encontrada;
			detalle.precio_usd_sutotal = detalle.subtotal / +this.solped.tasa_usd;
			// console.log(detalle.precio_usd_sutotal);
		}
	}

	cambioTasa(event) {
		if (this.solped.tasa_usd !== 0 && this.solped.monto_total && this.solped.monto_total !== 0) {
			/* 	for (const det of this.detallePreOC) {
					det.precio = det.precio_usd * this.solped.tasa_usd;
				} */
			this.detallePreOC.forEach((det) => {
				det.precio = +det.precio_usd * this.solped.tasa_usd;
				det.precio_neto = +det.precio * det.cant_encontrada;
				det.subtotal = ((+det.tasa_iva / 100) * +det.precio_neto) + +det.precio_neto;
			});
			console.log(this.solped.tasa_usd);

		}
	}

	volver() {
		this.router.navigate(["solpedsoc"]);
	}

	async registrarObservacion() {

		let newtraza: TrazasSolped = {
			justificacion: this.observacion,
			idSegUsuario: this.idUsuario,
			idEstadoSolped: this.solped.idEstadoActual,
			estadoActual: this.solped.estadoActual,
			estadoAnterior: this.solped.estadoActual,
			idSolpedCompras: this.idSolpedCompras
		};

		await this.svrTrazasSolped.insertTraza(newtraza);
		await this.svrTrazasSolped.notificarCambio(this.idSolpedCompras);
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Observación Insertada' });
		this.observacion = "";

	}

	selecProvee(e, detalle: SolpedDetalleModelo) {
		//console.log("Evento: ", e);
		//detalle.idProveedor = e.value.idProveedor;
		this.detalleSolpedNota.idProveedor = e.value.idProveedor;
		this.detalleSolpedNota.nombre_proveedor = e.value.nombre;
		//console.log("Como quedo: ", this.detalleSolpedNota);
	}

	async mostrarDialogos(tipo: number, detalle: SolpedDetalleModelo) {
		this.displayDialogoDet = true;
		this.tituloInsert = "Seleccionar Proveedor"; //(tipo == 1 ? "Insertar Nota" : "Insertar Proveedor");
		this.detalleSolpedNota = detalle;
		this.proveedores = await this.svrProveedores.getAll();
	}

	desagregarSolped(index: number, detalle: SolpedDetalleModelo) {
		//console.log("indice: ", index);

		let newdetallet = { ...detalle };
		newdetallet.idProveedor = null;
		newdetallet.nombre_proveedor = "";
		newdetallet.precio = null;
		newdetallet.precio_neto = null;
		newdetallet.precio_usd = null;
		newdetallet.cant_encontrada = null;

		newdetallet.tipo = "Agregado";
		this.detallePreOC.splice(index + 1, 0, newdetallet);
	}

	eliminarDetSolpedSegre(indice: number, DetalleSoPed: SolpedDetalleModelo) {
		this.detallePreOC.splice(indice, 1);
	}

	cerrarDialogoSolped() {
		this.displayDialogoDet = false;
		this.tituloInsert = "";
		this.proveedorSelect = {};
		this.detalleSolpedNota = {};
	}

	IsNumeric(val) {
		return Number(parseFloat(val)) === val;
	}

	validaCantidad(event, indice: number, idP: string, detalleSoPed: SolpedDetalleModelo) {
		//console.log(event.target.value);

		if (event.target.value) {

			if (parseFloat(event.target.value) > parseFloat(detalleSoPed.cantidad)) {
				//event.target.value = "";
				this.cantEncontrada = document.getElementById(idP) as HTMLElement;
				this.cantEncontrada.setAttribute('value', '');
				//this.cantEncontrada. = '';
				detalleSoPed.cant_encontrada = null;
				if (detalleSoPed.tipo === "Original") {
					let boton: ElementRef<HTMLButtonElement> = this.renderer.selectRootElement('#button' + idP, true);
					this.renderer.setAttribute(boton, "disabled", "true");
				}
				return false;
				//console.log("entros");

			}

			if (parseFloat(event.target.value) < parseFloat(detalleSoPed.cantidad)) {
				if (detalleSoPed.tipo === "Original") {
					let boton: ElementRef<HTMLButtonElement> = this.renderer.selectRootElement('#button' + idP, true);
					detalleSoPed.tipo === "Original" && this.renderer.removeAttribute(boton, "disabled");
					return false;
				}
			}


			/* 	if ((parseFloat(event.target.value) === parseFloat(detalleSoPed.cantidad)) && detalleSoPed.tipo === "Original") {
					return false;
				} */

			detalleSoPed.cant_encontrada = null;
			let detallesPreOCFiltred = this.detallePreOC.filter((current) => { return current.codigo === detalleSoPed.codigo });

			//console.log("filtrados: ", detallesPreOCFiltred);
			let cantporCodigo: number = 0;
			for (const detalle of detallesPreOCFiltred) {
				cantporCodigo += +detalle.cant_encontrada;
			}
			let cantTotal = cantporCodigo + +event.target.value;
			/* console.log("cant:", cantporCodigo);
			console.log("total:", cantTotal); */

			if (cantTotal > +detalleSoPed.cantidad) {
				//console.log("entro encot > cantidad");

				detalleSoPed.cant_encontrada = null;
				return false;
			}

			detalleSoPed.cant_encontrada = +event.target.value;

		}
	}



	async anularDetalle(indice: number, detalleSoPed: SolpedDetalleModelo) {
		this.confirmationService.confirm({
			message: `¿Seguro de ANULAR el producto: ${detalleSoPed.codigo}?`,
			accept: async () => {
				detalleSoPed.estado = 2

				let newtraza: TrazasSolped = {
					justificacion: (this.observacion == "" || !this.observacion ? `Anulación del producto: ${detalleSoPed.codigo} en solped: ${this.solped.idSolpedCompras}` : this.observacion),
					idSegUsuario: this.idUsuario,
					idSolpedCompras: this.idSolpedCompras
				};

				let newTrazaTicket: TrazaTicketServicio = {
					idTicketServicio: this.solped.idTicketServicio,
					justificacion: `Anulación del producto: ${detalleSoPed.codigo} en solped: ${this.solped.idSolpedCompras}`,
					idEstadoTicket: this.estadoAprobadoTicket.id,
					estadoAnterior: this.estadoAprobadoTicket.nombre,
					idSegUsuario: this.idUsuario
				}

				//console.log(detalleSoPed);

				await this.svrDetallesSol.updateDetSolped(detalleSoPed);

				await this.svrTrazasSolped.insertTraza(newtraza);
				await this.svrTicketTraza.nuevoTrazaP(newTrazaTicket);
				await this.svrSolped.getDataObsverver(this.solped.idSolpedCompras);

				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Producto Anulado!' });
				this.cargarDataDetalle();
				console.log(this.solped);

				if (this.solped.totDetallesNoProc === 0) {
					let idEstadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.anulado }))[0].idComprasEstadosSolped; //this.estados.enproceso; 5;
					let estadoActual = (this.estadosSolped.filter((estado) => { return estado.idComprasEstadosSolped == estadosSolped.anulado }))[0].nombre;
					newtraza.idEstadoSolped = idEstadoActual;
					newtraza.estadoActual = estadoActual;
					newtraza.estadoAnterior = this.solped.estadoActual;
					newtraza.justificacion += this.observacion + `Anulación total de la Solped nro.: ${this.solped.idSolpedCompras}`;
					this.solped.idEstadoActual = idEstadoActual;
					await this.svrSolped.cambiarFase({ idSolpedCompras: this.solped.idSolpedCompras, idEstadoActual: idEstadoActual, estadoActual: estadoActual });

					await this.svrTrazasSolped.insertTraza(newtraza);

					this.svrSolped.getDataObsverver(this.solped.idSolpedCompras);

					this.svrNotificaciones.nuevaNotificacionRecibe(
						`La Solped nro: ${this.solped.idSolpedCompras} fue anulada por completo. Porfavor contacte a COMPRAS`,
						this.currentUser.idSegUsuario,
						this.solped.idUsuarioRegistro,
						this.solped.idConfigGerencia
					)
						.subscribe((resp) => console.log(resp));

					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'success', summary: `Toda la Solped nro: ${this.solped.idSolpedCompras} fue Anulada!. Recuerde RECHAZAR el ticket manualmente` });
					setTimeout(() => { clearTimeout(); this.volver(); }, 4000);

				}

			}
		});
	}

	/* 
	mostrarNotas(event, over: OverlayPanel, detalle: SolpedDetalleModelo) {
			this.detalleSolpedNota = detalle;
			over.toggle(event);
		} */

}
