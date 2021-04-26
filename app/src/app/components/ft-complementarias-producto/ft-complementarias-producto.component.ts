import { Component, OnInit, Input } from '@angular/core';
import { TiposClasificacionService, SubtiposClasificacionService, ProductosService, ComplementariasService, TiposMedidasService, UnidadesMedidaService } from '../../services';
import { Producto, SubTipoClasificacion, TipoClasificacion, Propiedad, TipoMedida, UnidadMedida, ComplementariaProducto } from '../../models';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
	selector: 'app-ft-complementarias-producto',
	templateUrl: './ft-complementarias-producto.component.html',
	styleUrls: ['./ft-complementarias-producto.component.scss'],
	providers: [
		TiposClasificacionService,
		SubtiposClasificacionService,
		TiposMedidasService,
		UnidadesMedidaService,
		ComplementariasService,
		ProductosService,
		MessageService,
		ConfirmationService
	]
})
export class FtComplementariasProductoComponent implements OnInit {

	@Input() producto: Producto;
	@Input() puedeEditar: boolean;

	tiposClasificacion: TipoClasificacion[] = [];
	subtiposClasificacion: SubTipoClasificacion[] = [];
	propiedades: Propiedad[] = [];
	tiposMedidas: TipoMedida[] = [];
	tiposMedidas2: TipoMedida[] = [];
	unidadesMedidas: UnidadMedida[] = [];
	unidadesMedidas2: UnidadMedida[] = [];

	unidad: UnidadMedida = {};

	isDisabledSubTipoClasificacion: boolean;
	isDisabledPropiedad: boolean;
	isDisabledValor: boolean;
	isDisabledTipoMedidas: boolean;
	isDisabledUnidades: boolean;
	isDisabledButtonAddPropiedad: boolean;
	isDisabledObservacion: boolean;

	complementaria: ComplementariaProducto = {};
	itemComplemForDialog: ComplementariaProducto = {};
	cols: any[];


	displayDialog: boolean = false;

	tituloDialogo: string;

	selectedTipoClasificacion: TipoClasificacion = {};
	selectedSubTipo: SubTipoClasificacion = {};
	selectedPropiedad: Propiedad = {};
	selectedTipoMedida: TipoMedida = {};
	selectedUnidad: UnidadMedida = {};

	selectedPropiedadValor: any;
	selectedPropiedadObservacion: any;

	constructor(
		private srvTiposClasificacion: TiposClasificacionService,
		private srvSubTiposClasificacion: SubtiposClasificacionService,
		private srvTiposMedida: TiposMedidasService,
		private srvProducto: ProductosService,
		private svrComplementarias: ComplementariasService,
		private messageService: MessageService,
		private confirmationService: ConfirmationService
	) { }


	ngOnInit() {

		this.cols = [
			{ field: 'nombre_clasi', header: 'Clasificación', width: '10%' },
			{ field: 'nombre_subcla', header: 'Sub Clasi.', width: '10%' },
			{ field: 'propiedad', header: 'Propiedad', width: '10%' },
			{ field: 'valor', header: 'Valor', width: '10%' },
			{ field: 'unidadMedida', header: 'Unidad de Medida', width: '10%' },
			{ field: 'observacion', header: 'Observaciones', width: '40%' }

		];

		this.clear(true, true, true, true, true, true);
		this.disableDropDown(true, true, true, true, true, true, true);

		this.srvTiposClasificacion.consultarTodos()
			.toPromise()
			.then(results => { this.tiposClasificacion = results; })
			.catch(err => { console.log(err) });
	}


	disableDropDown(...drop: boolean[]) {

		this.isDisabledSubTipoClasificacion = drop[0];
		this.isDisabledPropiedad = drop[1];
		this.isDisabledValor = drop[2];
		this.isDisabledTipoMedidas = drop[3];
		this.isDisabledUnidades = drop[4];
		this.isDisabledButtonAddPropiedad = drop[5];
		this.isDisabledObservacion = drop[6];
	}

	clear(...clear: boolean[]) {
		
		if (clear[0]){
			this.selectedSubTipo = {};
			//this.selectedTipoClasificacion = {};
		}
		if (clear[1])
			this.selectedPropiedad = {};

		if (clear[2])
			this.selectedPropiedadValor = null;

		if (clear[3])
			this.selectedTipoMedida = {};

		if (clear[4])
			this.selectedUnidad = {};

		if (clear[5])
			this.selectedPropiedadObservacion = null;

	}

	agregarPropiedadComplementaria() {

		this.complementaria = {};

		let complementarias = [...this.producto.complementarias];

		this.complementaria.idAdmProducto = this.producto.idAdmProducto;
		this.complementaria.idAdmComplementariaProducto = -1;

		this.complementaria.aplicaComplementaria = 1;
		this.complementaria.idAdmPropiedad = this.selectedPropiedad.idAdmPropiedad;
		this.complementaria.idAdmUnidadMedida = this.selectedUnidad.idAdmUnidadMedida;
		this.complementaria.propiedad = this.selectedPropiedad.nombre;
		this.complementaria.valor = this.selectedPropiedadValor;
		this.complementaria.observacion = this.selectedPropiedadObservacion;
		this.complementaria.unidadMedida = this.selectedUnidad.label;
		this.complementaria.idAdmTipoMedida = this.selectedTipoMedida.idAdmTipoMedida;
		this.complementaria.esNuevo = 1;
		this.complementaria.nombre_clasi = this.selectedTipoClasificacion.label;
		this.complementaria.nombre_subcla = this.selectedSubTipo.label;
		this.complementaria.idAdmSubTipoClasificacion  = this.selectedSubTipo.idAdmSubTipoClasificacion;
		//let result = complementarias.filter(e => e.idAdmPropiedad.indexOf(this.complementaria.idAdmPropiedad) >= 0);

		//let result = complementarias.find(e => e.idAdmPropiedad == this.complementaria.idAdmPropiedad && e.idAdmProducto == this.complementaria.idAdmProducto);
		//console.log(result);
		//if (!result) {
			complementarias.push(this.complementaria);
		//}
		this.clear(true, true, true, true, true, true);
		this.disableDropDown(true, true, true, true, true, true, true);
		this.producto.complementarias = complementarias;
		this.selectedTipoClasificacion = {};
	}

	eliminarPropiedadAdicional(propiedadAdicional: ComplementariaProducto) {

		this.confirmationService.confirm(
			{
				message: "¿Desea Eliminar la propiedad de la lista?",
				accept: () => {
					this.svrComplementarias.eliminar(propiedadAdicional.idAdmComplementariaProducto).then(result => {
						let index = this.producto.complementarias.indexOf(propiedadAdicional);
						this.producto.complementarias = this.producto.complementarias.filter((val, i) => i != index);
						this.complementaria = {};
						this.clear(true, true, true, true, true, true);
					});
				}
			});
	}

	editPropiedadAdicional(propiedadComplementariaActual: ComplementariaProducto) {

		this.displayDialog = true;
		this.tituloDialogo = 'Editar propiedad: ' + propiedadComplementariaActual.propiedad;
		this.complementaria = propiedadComplementariaActual;

		this.itemComplemForDialog = this.cloneComplementarias(propiedadComplementariaActual);

		/* Tipos de medidas para un producto */
		this.srvTiposMedida.consultarTodos()
			.toPromise()
			.then(results => { this.tiposMedidas2 = results; })
			.catch(err => { console.log(err) });


		/* Unidades de medidas de un producto */
		this.srvTiposMedida.consultarUnidadesMedidasPoridAdmTipoMedida(this.itemComplemForDialog.idAdmTipoMedida)
			.toPromise()
			.then(results => { this.unidadesMedidas2 = results; })
			.catch(err => { console.log(err) });
	}

	savePropiedad() {

		this.unidad = this.unidadesMedidas2.filter(e => e.idAdmUnidadMedida == this.itemComplemForDialog.idAdmUnidadMedida)[0];

		if (!this.unidad) {
			this.showError("Debe seleccionar una unidad de medida");
			return;
		}

		this.itemComplemForDialog.unidadMedida = this.unidad.label;

		this.producto.complementarias[this.producto.complementarias.indexOf(this.complementaria)] = this.itemComplemForDialog;
		this.itemComplemForDialog = {};
		this.complementaria = {};
		this.cerrarDialogo();
	}

	cerrarDialogo() {
		this.displayDialog = false;
	}

	cloneComplementarias(c: ComplementariaProducto): ComplementariaProducto {
		let car = {};
		for (let prop in c) {
			car[prop] = c[prop];
		}
		return car;
	}


	onChangeTipoClasificacion(event) {

		this.clear(true, true, true, true, true, true);
		this.disableDropDown(false, false, false, false, false, false, false);

		this.srvTiposClasificacion.consultarSubTiposPoridAdmTipoClasificacion(this.selectedTipoClasificacion.idAdmTipoClasificacion)
			.toPromise()
			.then(results => { this.subtiposClasificacion = results; })
			.catch(err => { console.log(err) });

	}

	onChangeSubTipoClasificacion() {

		this.clear(false, true, true, true, true, true);
		//this.disableDropDown(false, false, true, true, true, true, true);

		this.srvSubTiposClasificacion.consultarPropiedadesAsignadas(this.selectedSubTipo.idAdmSubTipoClasificacion)
			.toPromise()
			.then(results => { this.propiedades = results; })
			.catch(err => { console.log(err) });

		/*     this.srvSubTiposClasificacion.consultarPropiedadesPorIdSubTipoClasificacion(this.selectedSubTipo.idAdmSubTipoClasificacion)
			.toPromise()
			.then(results => { this.propiedades = results; })
			.catch(err => { console.log(err) }); */

	}

	onChangePropiedades(event) {

		this.clear(false, false, true, true, true, true);
		//this.disableDropDown(false, false, false, false, true, true, true);

		this.srvTiposMedida.consultarTodos()
			.toPromise()
			.then(results => { this.tiposMedidas = results; })
			.catch(err => { console.log(err) });
	}

	onChangeTipoMedida(event) {

		this.clear(false, false, false, false, true, true);
		//this.disableDropDown(false, false, false, false, false, true, true);

		this.srvTiposMedida.consultarUnidadesMedidasPoridAdmTipoMedida(this.selectedTipoMedida.idAdmTipoMedida)
			.toPromise()
			.then(results => { this.unidadesMedidas = results; })
			.catch(err => { console.log(err) });


	}

	onChangeTipoMedida2(event) {

		this.srvTiposMedida.consultarUnidadesMedidasPoridAdmTipoMedida(this.itemComplemForDialog.idAdmTipoMedida)
			.toPromise()
			.then(results => { this.unidadesMedidas2 = results; })
			.catch(err => { console.log(err) });
	}


	onChangeUnidadMedida(event) {

		this.clear(false, false, false, false, false, false);
		this.disableDropDown(false, false, false, false, false, false, false);
	}

	private showError(errMsg: string) {
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'error', summary: errMsg });
	}

	private showSuccess(successMsg: string) {
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'success', summary: successMsg });
	}

}
