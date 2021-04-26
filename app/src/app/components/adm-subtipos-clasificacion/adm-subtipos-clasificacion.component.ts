import { Component, OnInit } from '@angular/core';
import { TipoClasificacion, SubTipoClasificacion, Propiedad } from '../../models';
import { TiposClasificacionService, SubtiposClasificacionService, PropiedadSubTipoService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
	selector: 'app-adm-subtipos-clasificacion',
	templateUrl: './adm-subtipos-clasificacion.component.html',
	styleUrls: ['./adm-subtipos-clasificacion.component.scss'],
	providers: [ConfirmationService,
		MessageService,
		TiposClasificacionService,
		SubtiposClasificacionService,
		PropiedadSubTipoService
	]
})
export class AdmSubtiposClasificacionComponent implements OnInit {

	displayDialog: boolean;
	displayDialogDetail: boolean;

	newSubTipoClasificacion: boolean;
	tituloDialogo: string = "";
	tituloDialogoDetail: string = "";

	tiposClasificaciones: TipoClasificacion[];

	subTipoClasificacion: SubTipoClasificacion = {};
	subTipoClasificacionDetail: SubTipoClasificacion = {};
	subTipoClasificaciones: SubTipoClasificacion[];

	selectedSubTipoClasificacion: SubTipoClasificacion;

	propiedadesNoAsignadas: Propiedad[];
	propiedadesNoAsignadasSelected: Propiedad[];

	propiedadesAsignadas: Propiedad[] = [];
	propiedadesAsignadasSelected: Propiedad[] = [];

	cols: any[];

	constructor(
		private srvTipoClasificacionProductos: TiposClasificacionService,
		private srvSubTipoClasificacionProductos: SubtiposClasificacionService,
		private srvPropiedadSubtipo: PropiedadSubTipoService,
		private confirmationService: ConfirmationService,
		private messageService: MessageService) { }

	ngOnInit() {

		this.consultarSubTiposClasificacionProducto();


		this.cols = [
			{ field: 'idAdmSubTipoClasificacion', header: 'ID', width: '10%' },
			{ field: 'tipoClasificacion', header: 'Tipo Clasificación', width: '20%' },
			{ field: 'nombre', header: 'SubTipo Clasificación', width: '30%' },
			{ field: 'fechaAlta', header: 'Fecha de Alta', width: '15%' }
		];
	}

	consultarTiposClasificacionProducto() {

		this.srvTipoClasificacionProductos.consultarTodos()
			.toPromise()
			.then(results => { this.tiposClasificaciones = results; })
			.catch(err => { console.log(err) });
	}

	consultarSubTiposClasificacionProducto() {

		this.srvSubTipoClasificacionProductos.consultarTodos()
			.toPromise()
			.then(results => {
				this.subTipoClasificaciones = results;
			})
			.catch(err => { console.log(err) });
	}

	consultarPropiedadesAsignadas() {

		this.propiedadesAsignadasSelected = [];

		this.srvSubTipoClasificacionProductos.consultarPropiedadesAsignadas(this.subTipoClasificacionDetail.idAdmSubTipoClasificacion)
			.toPromise()
			.then(results => {
				this.propiedadesAsignadas = results;
			})
			.catch(err => { console.log(err) });
	}


	consultarPropiedadesNoAsignadas() {

		this.propiedadesNoAsignadasSelected = [];

		this.srvSubTipoClasificacionProductos.consultarPropiedadesNoAsignadas(this.subTipoClasificacionDetail.idAdmSubTipoClasificacion)
			.toPromise()
			.then(results => {
				this.propiedadesNoAsignadas = results;
			})
			.catch(err => { console.log(err) });
	}

	showDialogToAdd() {
		this.newSubTipoClasificacion = true;
		this.tituloDialogo = "Nuevo SubTipo Clasificación Producto";
		this.subTipoClasificacion = {};
		this.tiposClasificaciones = [];
		this.consultarTiposClasificacionProducto();
		this.displayDialog = true;
	}

	guardar() {

		if (this.newSubTipoClasificacion) {

			this.srvSubTipoClasificacionProductos.registrar(this.subTipoClasificacion)
				.toPromise()
				.then(results => { this.consultarSubTiposClasificacionProducto(); })
				.catch(err => { console.log(err) });

			this.showSuccess('SubTipo Clasificación se ha creado satisfactoriamente');
		}
		else {

			this.srvSubTipoClasificacionProductos.actualizar(this.subTipoClasificacion)
				.toPromise()
				.then(results => { this.consultarSubTiposClasificacionProducto(); })
				.catch(err => { console.log(err) });

			this.showSuccess('SubTipo Clasificación se ha actualizado satisfactoriamente');

		}
		this.subTipoClasificacion = null;
		this.displayDialog = false;
	}

	edit(subTipoClasificacionActual: SubTipoClasificacion) {

		this.newSubTipoClasificacion = false;
		this.subTipoClasificacion = this.cloneSubTipoClasificacion(subTipoClasificacionActual);
		this.displayDialog = true;
		this.tituloDialogo = "Editar: " + this.subTipoClasificacion.nombre;
		this.consultarTiposClasificacionProducto();
	}

	asignarPropiedades(subTipoClasificacionActual: SubTipoClasificacion) {

		this.displayDialogDetail = true;
		this.subTipoClasificacionDetail = this.cloneSubTipoClasificacion(subTipoClasificacionActual);
		this.tituloDialogoDetail = "Asignar Propiedades";

		this.consultarPropiedadesNoAsignadas();
		this.consultarPropiedadesAsignadas();
	}

	asignarPropiedadesSubTipo() {

		for (let item of this.propiedadesNoAsignadasSelected) {

			this.srvPropiedadSubtipo.registrar(this.subTipoClasificacionDetail, item)
				.toPromise()
				.then(results => {
					this.consultarPropiedadesNoAsignadas();
					this.consultarPropiedadesAsignadas();
				})
				.catch(err => { console.log(err) });
		}
		this.showSuccess('Cambios realizados satisfactoriamente');
	}

	quitarPropiedadesSubTipo() {

		for (let item of this.propiedadesAsignadasSelected) {

			this.srvPropiedadSubtipo.eliminar(this.subTipoClasificacionDetail.idAdmSubTipoClasificacion, item)
				.toPromise()
				.then(results => {
					this.consultarPropiedadesNoAsignadas();
					this.consultarPropiedadesAsignadas();
				})
				.catch(err => { console.log(err) });
		}
		this.showSuccess('Cambios realizados satisfactoriamente');

	}

	remove(subTipoClasificacionActual: SubTipoClasificacion) {

		this.confirmationService.confirm(
			{
				message: "¿Desea Eliminar el registro?",
				accept: () => {
					this.eliminarSubGrupo(subTipoClasificacionActual);
				}
			});
	}

	eliminarSubGrupo(subTipoClasificacionActual: SubTipoClasificacion) {

		this.srvSubTipoClasificacionProductos.eliminar(subTipoClasificacionActual.idAdmSubTipoClasificacion)
			.toPromise()
			.then(results => { this.consultarSubTiposClasificacionProducto() })
			.catch(err => { console.log(err) });

		this.showSuccess('SubTipo Clasificación se ha eliminado satisfactoriamente');
	}

	cerrar() {
		this.subTipoClasificacion = null;
		this.displayDialog = false;
	}

	closeDialogDetail() {
		this.displayDialogDetail = false;
		this.subTipoClasificacionDetail = null;
	}

	cloneSubTipoClasificacion(c: SubTipoClasificacion): SubTipoClasificacion {
		let car = {};
		for (let prop in c) {
			car[prop] = c[prop];
		}
		return car;
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
