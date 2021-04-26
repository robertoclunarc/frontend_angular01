import { Component, OnInit, Input } from '@angular/core';
import { TiposClasificacionService } from 'src/app/services/tipos-clasificacion.service';
import { Producto, SubTipoClasificacion, TipoClasificacion, Propiedad, TipoMedida, UnidadMedida, ComplementariaProducto } from 'src/app/models';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { SubtiposClasificacionService, ProductosService, ComplementariasService, TiposMedidasService, UnidadesMedidaService } from 'src/app/services';


@Component({
	selector: 'app-ft-datos-adicionales-producto',
	templateUrl: './ft-datos-adicionales-producto.component.html',
	styleUrls: ['./ft-datos-adicionales-producto.component.scss'],
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
export class FtDatosAdicionalesProductoComponent implements OnInit {

	@Input() producto: Producto;
	@Input() puedeEditar: boolean;

	isDisabledSubTipoClasificacion: boolean;
	isDisabledPropiedad: boolean;
	isDisabledValor: boolean;
	isDisabledTipoMedidas: boolean;
	isDisabledUnidades: boolean;
	isDisabledButtonAddPropiedad: boolean;


	tiposClasificacion: TipoClasificacion[] = [];
	subtiposClasificacion: SubTipoClasificacion[] = [];
	propiedades: Propiedad[] = [];

	tiposMedidas: TipoMedida[] = [];
	tiposMedidas2: TipoMedida[] = [];

	unidadesMedidas: UnidadMedida[] = [];
	unidadesMedidas2: UnidadMedida[] = [];

	unidad: UnidadMedida = {};

	propiedadAdicional: ComplementariaProducto = {};
	itemPropiedadAdicionalForDialog: ComplementariaProducto = {};

	displayDialog: boolean = false;
	tituloDialogo: string;

	cols: any[];

	selectedTipoClasificacion: TipoClasificacion = {};
	selectedSubTipo: SubTipoClasificacion = {};
	selectedPropiedad: Propiedad = {};
	selectedTipoMedida: TipoMedida = {};
	selectedUnidad: UnidadMedida = {};

	selectedPropiedadValor: any;

	constructor(
		private srvTiposClasificacion: TiposClasificacionService,
		private srvSubTiposClasificacion: SubtiposClasificacionService,
		private srvTiposMedida: TiposMedidasService,
		private srvUnidaMedidas: UnidadesMedidaService,
		private srvProducto: ProductosService,
		private messageService: MessageService,
		private confirmationService: ConfirmationService,
		private svrComplementarias :  ComplementariasService) { }

	ngOnInit() {

		this.cols = [
			{ field: 'propiedad', header: 'Propiedad', width: '30%' },
			{ field: 'valor', header: 'Valor', width: '20%' },
			{ field: 'unidadMedida', header: 'Unidad de Medida', width: '20%' }
		];

		this.clear(true, true, true, true, true);                 // limpia los controles visuales
		this.disableDropDown(true, true, true, true, true, true); // Habilita o deshabilita los controles visuales

		/* Se inicia la informacion con el select de tipo clasificacion */
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
	}

	clear(...clear: boolean[]) {
		if (clear[0])
			this.selectedSubTipo = {};

		if (clear[1])
			this.selectedPropiedad = {};

		if (clear[2])
			this.selectedPropiedadValor = null;

		if (clear[3])
			this.selectedTipoMedida = {};

		if (clear[4])
			this.selectedUnidad = {};
	}

	agregarPropiedadAdicional() {

		this.propiedadAdicional = {};

		let adicionales = [...this.producto.adicionales];

		this.propiedadAdicional.idAdmProducto = this.producto.idAdmProducto;
		this.propiedadAdicional.observacion = null;
		this.propiedadAdicional.idAdmComplementariaProducto = null;

		this.propiedadAdicional.aplicaComplementaria = 0;
		this.propiedadAdicional.idAdmPropiedad = this.selectedPropiedad.idAdmPropiedad;
		this.propiedadAdicional.idAdmUnidadMedida = this.selectedUnidad.idAdmUnidadMedida;
		this.propiedadAdicional.propiedad = this.selectedPropiedad.nombre;
		this.propiedadAdicional.unidadMedida = this.selectedUnidad.label;
		this.propiedadAdicional.idAdmTipoMedida = this.selectedTipoMedida.idAdmTipoMedida;
		this.propiedadAdicional.valor = this.selectedPropiedadValor;
		this.propiedadAdicional.esNuevo = true;
		this.propiedadAdicional.idAdmSubTipoClasificacion = this.selectedSubTipo.idAdmSubTipoClasificacion;

		let result = adicionales.filter(e => e.idAdmPropiedad == this.propiedadAdicional.idAdmPropiedad && e.idAdmProducto == this.propiedadAdicional.idAdmProducto);

		if (result.length == 0) {
			adicionales.push(this.propiedadAdicional);
		}
		//console.log(adicionales);
		this.producto.adicionales = adicionales;
	}


	eliminarPropiedadAdicional(propiedadAdicional: ComplementariaProducto) {

		this.confirmationService.confirm(
			{
				message: "¿Desea Eliminar la propiedad de la lista?",
				accept: () => {
					this.svrComplementarias.eliminar(propiedadAdicional.idAdmComplementariaProducto).then(result => {
						let index = this.producto.adicionales.indexOf(propiedadAdicional);
						this.producto.adicionales = this.producto.adicionales.filter((val, i) => i != index);
						this.propiedadAdicional = {};
					});
					
					
				}
			});
	}

	editPropiedadAdicional(propiedadAdicionalActual: ComplementariaProducto) {

		this.displayDialog = true;
		this.tituloDialogo = 'Editar propiedad: ' + propiedadAdicionalActual.propiedad;
		this.propiedadAdicional = propiedadAdicionalActual;
		this.itemPropiedadAdicionalForDialog = this.cloneAdicionales(propiedadAdicionalActual);

		/* Tipos de medidas para un producto */
		this.srvTiposMedida.consultarTodos()
			.toPromise()
			.then(results => { this.tiposMedidas2 = results; })
			.catch(err => { console.log(err) });


		/* Unidades de medidas de un producto */
		this.srvTiposMedida.consultarUnidadesMedidasPoridAdmTipoMedida(this.itemPropiedadAdicionalForDialog.idAdmTipoMedida)
			.toPromise()
			.then(results => { this.unidadesMedidas2 = results; })
			.catch(err => { console.log(err) });

	}

	savePropiedad() {

		this.unidad = this.unidadesMedidas2.filter(e => e.idAdmUnidadMedida == this.itemPropiedadAdicionalForDialog.idAdmUnidadMedida)[0];

		if (!this.unidad) {
			this.showError("Debe seleccionar una unidad de medida");
			return;
		}

		this.itemPropiedadAdicionalForDialog.unidadMedida = this.unidad.label;

		this.producto.adicionales[this.producto.adicionales.indexOf(this.propiedadAdicional)] = this.itemPropiedadAdicionalForDialog;
		this.itemPropiedadAdicionalForDialog = {};
		this.propiedadAdicional = {};
		this.cerrarDialogo();
	}

	cerrarDialogo() {
		this.displayDialog = false;
	}

	cloneAdicionales(c: ComplementariaProducto): ComplementariaProducto {
		let car = {};
		for (let prop in c) {
			car[prop] = c[prop];
		}
		return car;
	}

	onChangeTipoClasificacion(event) {

		this.clear(true, true, true, true, true);
		this.disableDropDown(false, true, true, true, true, true);

		let idAdmTipoClasificacion = this.selectedTipoClasificacion.idAdmTipoClasificacion;

		/* Se los subTipoClasificacion de un grupo */
		this.srvTiposClasificacion.consultarSubTiposPoridAdmTipoClasificacion(idAdmTipoClasificacion)
			.toPromise()
			.then(results => { this.subtiposClasificacion = results; })
			.catch(err => { console.log(err) });
	}

	onChangeSubTipoClasificacion(event) {

		this.clear(false, true, true, true, true);
		this.disableDropDown(false, false, true, true, true, true);

		let idAdmSubTipoClasificacion = this.selectedSubTipo.idAdmSubTipoClasificacion;

		/* Se los subTipoClasificacion de un grupo */
		this.srvSubTiposClasificacion.consultarPropiedadesAsignadas(idAdmSubTipoClasificacion)
			.toPromise()
			.then(results => { this.propiedades = results; })
			.catch(err => { console.log(err) });

/*     this.srvSubTiposClasificacion.consultarPropiedadesPorIdSubTipoClasificacion(idAdmSubTipoClasificacion)
      .toPromise()
      .then(results => { this.propiedades = results; })
      .catch(err => { console.log(err) });
 */  }

	onChangePropiedades(event) {

		this.clear(false, false, true, true, true);
		this.disableDropDown(false, false, false, false, true, true);

		this.srvTiposMedida.consultarTodos()
			.toPromise()
			.then(results => { this.tiposMedidas = results; })
			.catch(err => { console.log(err) });
	}

	onChangeTipoMedida(event) {

		this.clear(false, false, false, false, true);
		this.disableDropDown(false, false, false, false, false, true);

		let idAdmTipoMedida = this.selectedTipoMedida.idAdmTipoMedida;

		this.srvTiposMedida.consultarUnidadesMedidasPoridAdmTipoMedida(idAdmTipoMedida)
			.toPromise()
			.then(results => { this.unidadesMedidas = results; })
			.catch(err => { console.log(err) });
	}

	onChangeTipoMedida2(event) {

		this.srvTiposMedida.consultarUnidadesMedidasPoridAdmTipoMedida(this.itemPropiedadAdicionalForDialog.idAdmTipoMedida)
			.toPromise()
			.then(results => { this.unidadesMedidas2 = results; })
			.catch(err => { console.log(err) });
	}

	onChangeUnidadMedida(event) {

		this.clear(false, false, false, false, false);
		this.disableDropDown(false, false, false, false, false, false);
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
