import { Component, OnInit, Input } from '@angular/core';
import { Producto, AreaTrabajo, AplicabilidadProducto, GerenciasModelo } from '../../models';
import { GerenciasService, AreasTrabajoService, ProductosService, AplicabilidadService } from '../../services';
import { ConfirmationService, MessageService, } from 'primeng/api';


@Component({
	selector: 'app-ft-aplicabilidad-producto',
	templateUrl: './ft-aplicabilidad-producto.component.html',
	styleUrls: ['./ft-aplicabilidad-producto.component.scss'],
	providers: [
		GerenciasService,
		AreasTrabajoService,
		ProductosService,
		MessageService,
		ConfirmationService
	]
})
export class FtAplicabilidadProductoComponent implements OnInit {


	@Input() producto: Producto;
	@Input() puedeEditar: boolean;

	cols: any[];

	gerencias: GerenciasModelo[];
	gerenciasForDialog: GerenciasModelo[];

	areasTrabajo: AreaTrabajo[];
	areasTrabajoForDialog: AreaTrabajo[];

	aplicabilidad: AplicabilidadProducto = {};
	aplicabilidades: AplicabilidadProducto = {};


	selectedGerencia: GerenciasModelo = {};
	selectedAreaTrabajo: AreaTrabajo = {};

	isDisabledAreaTrabajo: boolean;
	isDisabledCodigo: boolean;
	isDisabledNombre: boolean;
	isDisabledUso: boolean;
	isDisabledObservaciones: boolean;
	isDisabledButtonAddAplicabilidad: boolean;

	selectedUso: any;
	selectedObservaciones: any;

	productoAplicabilidad: Producto = {};
	productoAplicabilidadForDialog: Producto = {};
	productos: Producto[] = [];
	productosDialog: Producto[] = [];

	displayDialog: boolean;
	tituloDialogo: string;

	itemAplicabilidadForDialog: AplicabilidadProducto = {};

	constructor(
		private srvGerencias: GerenciasService,
		private srvProductos: ProductosService,
		private svrAplicabilidad: AplicabilidadService,
		private messageService: MessageService,
		private confirmationService: ConfirmationService
	) { }

	ngOnInit() {

		this.cols = [
			{ field: 'gerencia', header: 'Gerencia', width: '15%' },
			{ field: 'areagerencia', header: 'Area Trabajo', width: '15%' },
			{ field: 'producto', header: 'Producto', width: '15%' },
			{ field: 'descripcionUso', header: 'Descripción de Uso', width: '25%' },
			{ field: 'observacion', header: 'Observaciones', width: '20%' }
		];

		this.clear(true, true, true, true);
		this.disableDropDown(true, true, true, true, true, true, true);

		this.srvGerencias.getTodos()
			//.toPromise()
			.then(results => { this.gerencias = results; })
			.catch(err => { console.log(err) });
	}

	disableDropDown(...drop: boolean[]) {

		this.isDisabledAreaTrabajo = drop[0];
		this.isDisabledCodigo = drop[1];
		this.isDisabledNombre = drop[2];
		this.isDisabledUso = drop[3];
		this.isDisabledObservaciones = drop[4];
		this.isDisabledButtonAddAplicabilidad = drop[5];
	}

	clear(...clear: boolean[]) {

		if (clear[0])
			this.selectedAreaTrabajo = {};

		if (clear[1])
			this.productoAplicabilidad = {};

		if (clear[2])
			this.selectedUso = null;

		if (clear[3])
			this.selectedObservaciones = null;
	}


	onChangeGerencia(event) {

		this.clear(true, true, true, true);
		this.disableDropDown(false, true, true, true, true, true, true);

		this.srvGerencias.getAreasTrabajoGerencia(this.selectedGerencia.idConfigGerencia)
			.toPromise()
			.then(results => { this.areasTrabajo = results; })
			.catch(err => { console.log(err) });
	}

	onChangeGerenciaForDialog() {

		this.srvGerencias.getAreasTrabajoGerencia(this.itemAplicabilidadForDialog.idConfigGerencia)
			.toPromise()
			.then(results => { this.areasTrabajoForDialog = results; })
			.catch(err => { console.log(err) });
	}

	onChangeAreas(event) {

		this.clear(false, true, true, true);
		this.disableDropDown(false, false, false, false, false, false);
	}

	eliminarAplicabilidad(aplicabilidad: AplicabilidadProducto) {

		this.confirmationService.confirm(
			{
				message: "¿Desea Eliminar item de la lista?",
				accept: () => {
					this.svrAplicabilidad.eliminar(aplicabilidad.idAdmAplicabilidadProducto).then(result => {
						let index = this.producto.aplicabilidad.indexOf(aplicabilidad);
						this.producto.aplicabilidad = this.producto.aplicabilidad.filter((val, i) => i != index);
						this.aplicabilidad = {};
					});

				}
			});
	}

	buscarDatosProductosCod(e) {

		let json = { 'campo1': 'codigo' };

		this.srvProductos.busquedaPorCamposJSONFrase(json, e.query)
			.toPromise()
			.then(results => { this.productos = results; })
			.catch(err => { console.log(err) });
	}

	buscarDatosProductosNombre(e) {

		let json = { 'campo1': 'nombre' };

		this.srvProductos.busquedaPorCamposJSONFrase(json, e.query)
			.toPromise()
			.then(results => { this.productos = results; })
			.catch(err => { console.log(err) });
	}

	buscarDatosProductosNombreDialog(e) {

		let json = { 'campo1': 'nombre' };

		this.srvProductos.busquedaPorCamposJSONFrase(json, e.query)
			.toPromise()
			.then(results => { this.productosDialog = results; })
			.catch(err => { console.log(err) });
	}

	agregarAplicabilidad() {

		this.aplicabilidad = {};

		let aplicabilidades = [...this.producto.aplicabilidad];

		if (this.selectedUso == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar la descripción del USO' });
			return false;

		}

		this.aplicabilidad.idAdmAplicabilidadProducto = -1;
		this.aplicabilidad.idAdmProductoPadre = this.producto.idAdmProducto;
		this.aplicabilidad.gerencia = this.selectedGerencia.nombre;
		this.aplicabilidad.idConfigGerencia = this.selectedGerencia.idConfigGerencia;
		this.aplicabilidad.areagerencia = this.selectedAreaTrabajo.nombre;
		this.aplicabilidad.idAreaTrabajoGerencia = this.selectedAreaTrabajo.idAdmAreaTrabajoGerencia;
		this.aplicabilidad.producto = this.productoAplicabilidad.nombre;
		this.aplicabilidad.idAdmProductoHijo = (this.productoAplicabilidad.idAdmProducto == null ? 0 : this.productoAplicabilidad.idAdmProducto);
		this.aplicabilidad.observacion = (this.selectedObservaciones == null ? "" : this.selectedObservaciones);
		this.aplicabilidad.descripcionUso = this.selectedUso;
		this.aplicabilidad.esNuevo = true;

		let result = aplicabilidades.filter(e =>
			e.gerencia === this.aplicabilidad.gerencia &&
			e.areagerencia === this.aplicabilidad.areagerencia &&
			e.producto === this.aplicabilidad.producto);

		if (result.length == 0) {
			//console.log(this.aplicabilidad);
			aplicabilidades.push(this.aplicabilidad);
			this.clear(true, true, true, true);
			this.disableDropDown(true, true, true, true, true, true, true);
		}
		this.producto.aplicabilidad = aplicabilidades;
		this.selectedGerencia = {};

	}

	editAplicabilidad(aplicabilidadActual: AplicabilidadProducto) {

		this.displayDialog = true;
		this.tituloDialogo = "Editar: " + aplicabilidadActual.gerencia + " > " + aplicabilidadActual.areagerencia + " > " + aplicabilidadActual.producto;

		this.srvGerencias.getTodos()
			//.toPromise()
			.then(results => {
				this.gerenciasForDialog = results;
			})
			.catch(err => { console.log(err) });


		this.aplicabilidad = aplicabilidadActual;
		this.itemAplicabilidadForDialog = this.cloneAplicabilidad(aplicabilidadActual);

		this.srvGerencias.getAreasTrabajoGerencia(this.itemAplicabilidadForDialog.idConfigGerencia)
			.toPromise()
			.then(results => { this.areasTrabajoForDialog = results; })
			.catch(err => { console.log(err) });

	}

	savePropiedad() {

		let gerencia: GerenciasModelo = this.gerenciasForDialog.filter(e => e.idConfigGerencia == this.itemAplicabilidadForDialog.idConfigGerencia)[0];
		this.itemAplicabilidadForDialog.gerencia = gerencia.nombre;

		let areaTrabajo: AreaTrabajo = this.areasTrabajoForDialog.filter(e => e.idAdmAreaTrabajoGerencia == this.itemAplicabilidadForDialog.idAreaTrabajoGerencia)[0];
		//console.log(areaTrabajo);

		this.itemAplicabilidadForDialog.areagerencia = areaTrabajo.label;


		this.producto.aplicabilidad[this.producto.aplicabilidad.indexOf(this.aplicabilidad)] = this.itemAplicabilidadForDialog;
		this.itemAplicabilidadForDialog = {};
		this.aplicabilidad = {};
		this.cerrarDialogo();
	}


	cerrarDialogo() {
		this.displayDialog = false;
	}


	cloneAplicabilidad(c: AplicabilidadProducto): AplicabilidadProducto {
		let aplicabilidad = {};
		for (let prop in c) {
			aplicabilidad[prop] = c[prop];
		}
		return aplicabilidad;
	}


	private showError(errMsg: string) {
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'error', summary: errMsg });
	}

}
