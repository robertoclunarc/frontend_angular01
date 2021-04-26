import { Component, OnInit } from '@angular/core';
import { AreaTrabajo, GerenciasModelo } from '../../models';
import { AreasTrabajoService, GerenciasService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
	selector: 'app-adm-areas-trabajo',
	templateUrl: './adm-areas-trabajo.component.html',
	styleUrls: ['./adm-areas-trabajo.component.scss'],
	providers: [ConfirmationService,
		MessageService,
		AreasTrabajoService
	]
})
export class AdmAreasTrabajoComponent implements OnInit {

	displayDialog: boolean;
	newAreaTrabajo: boolean;
	tituloDialogo: string = "";

	gerencias: GerenciasModelo[];

	areaTrabajo: AreaTrabajo = {};
	areasTrabajo: AreaTrabajo[];

	selectedAreaTrabajo: AreaTrabajo;

	cols: any[];


	constructor(
		private srvGerencias: GerenciasService,
		private srvAreasTrabajo: AreasTrabajoService,
		private confirmationService: ConfirmationService,
		private messageService: MessageService, ) { }

	ngOnInit() {

		this.consultarAreasTrabajo();

		this.cols = [
			{ field: 'idAdmAreaTrabajoGerencia', header: 'ID', width: '15%' },
			{ field: 'gerencia', header: 'Gerencia', width: '25%' },
			{ field: 'nombre', header: 'Area', width: '30%' },
			{ field: 'fechaAlta', header: 'Fecha de Alta', width: '20%' }
		];
	}

	consultarGerencias() {

		this.srvGerencias.getTodos()
			.then(results => { this.gerencias = results; })
			.catch(err => { console.log(err) });
	}

	consultarAreasTrabajo() {

		this.srvAreasTrabajo.consultarTodos()
			.toPromise()
			.then(results => {
			this.areasTrabajo = results;
			})
			.catch(err => { console.log(err) });
	}

	showDialogToAdd() {
		this.newAreaTrabajo = true;
		this.tituloDialogo = "Nueva Area de Trabajo";
		this.areaTrabajo = {};
		this.gerencias = [];
		this.consultarGerencias();
		this.displayDialog = true;
	}

	guardar() {

		if (this.newAreaTrabajo) {

			this.srvAreasTrabajo.registrar(this.areaTrabajo)
				.toPromise()
				.then(results => { this.consultarAreasTrabajo(); })
				.catch(err => { console.log(err) });

			this.showSuccess('Area de Trabajo se ha creado satisfactoriamente');
		}
		else {

			this.srvAreasTrabajo.actualizar(this.areaTrabajo)
				.toPromise()
				.then(results => { this.consultarAreasTrabajo(); })
				.catch(err => { console.log(err) });

			this.showSuccess('Area de Trabajo se ha actualizado satisfactoriamente');

		}
		this.areaTrabajo = null;
		this.displayDialog = false;

	}

	edit(areaTrabajoActual: AreaTrabajo) {

		this.newAreaTrabajo = false;
		this.areaTrabajo = this.cloneAreaTrabajo(areaTrabajoActual);
		this.displayDialog = true;
		this.tituloDialogo = "Editar: " + this.areaTrabajo.nombre;
		this.consultarGerencias();
	}

	remove(areaTrabajoActual: AreaTrabajo) {

		this.confirmationService.confirm(
			{
				message: "¿Desea Eliminar el registro?",
				accept: () => {
					this.eliminarAreaTrabajo(areaTrabajoActual);
				}
			});
	}

	eliminarAreaTrabajo(areaTrabajoActual: AreaTrabajo) {

		this.srvAreasTrabajo.eliminar(areaTrabajoActual.idAdmAreaTrabajoGerencia)
			.toPromise()
			.then(results => { this.consultarAreasTrabajo() })
			.catch(err => { console.log(err) });

		this.showSuccess('Area de Trabajo se ha eliminado satisfactoriamente');

	}

	cerrar() {
		this.areaTrabajo = null;
		this.displayDialog = false;
	}

	cloneAreaTrabajo(c: AreaTrabajo): AreaTrabajo {
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
