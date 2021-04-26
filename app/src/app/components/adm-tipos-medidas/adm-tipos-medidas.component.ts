import { Component, OnInit } from '@angular/core';
import { TipoMedida } from '../../models';
import { TiposMedidasService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
	selector: 'app-adm-tipos-medidas',
	templateUrl: './adm-tipos-medidas.component.html',
	styleUrls: ['./adm-tipos-medidas.component.scss'],
	providers: [ConfirmationService, MessageService, TiposMedidasService]
})
export class AdmTiposMedidasComponent implements OnInit {

	displayDialog: boolean;
	newTipoMedida: boolean;
	tituloDialogo: string = "";

	tipoMedida: TipoMedida = {};
	tipoMedidas: TipoMedida[];

	selectedTipoMedida: TipoMedida;

	cols: any[];

	constructor(
		private srvTiposMedidaProductos: TiposMedidasService,
		private confirmationService: ConfirmationService,
		private messageService: MessageService
	) { }

	ngOnInit() {

		this.consultarTiposMedidaProducto();

		this.cols = [
			{ field: 'idAdmTipoMedida', header: 'ID', width: '15%' },
			{ field: 'nombre', header: 'Nombre', width: '25%' },
			{ field: 'descripcion', header: 'Descripcion', width: '30%' },
			{ field: 'fechaAlta', header: 'Fecha de Alta', width: '20%' },
		];
	}


	consultarTiposMedidaProducto() {

		this.srvTiposMedidaProductos.consultarTodos()
			.toPromise()
			.then(results => { this.tipoMedidas = results; })
			.catch(err => { console.log(err) });
	}

	guardar() {

		if (this.newTipoMedida) {

			this.srvTiposMedidaProductos.registrar(this.tipoMedida)
				.toPromise()
				.then(results => { this.consultarTiposMedidaProducto(); })
				.catch(err => { console.log(err) });

			this.showSuccess('Tipo de medida se ha creado satisfactoriamente');
		}
		else {

			this.srvTiposMedidaProductos.actualizar(this.tipoMedida)
				.toPromise()
				.then(results => { this.consultarTiposMedidaProducto(); })
				.catch(err => { console.log(err) });

			this.showSuccess('Tipo de medida se ha actualizado satisfactoriamente');

		}
		this.tipoMedida = null;
		this.displayDialog = false;
	}


	edit(tipoMedidaActual: TipoMedida) {

		this.newTipoMedida = false;
		this.tipoMedida = this.cloneGrupo(tipoMedidaActual);
		this.displayDialog = true;
		this.tituloDialogo = "Editar: " + this.tipoMedida.nombre;
	}

	remove(tipoMedidaActual: TipoMedida) {

		this.confirmationService.confirm(
			{
				message: "¿Desea Eliminar el registro?",
				accept: () => {

					this.eliminarGrupo(tipoMedidaActual);

				}
			});
	}


	eliminarGrupo(tipoMedidaActual: TipoMedida) {

		this.srvTiposMedidaProductos.eliminar(tipoMedidaActual.idAdmTipoMedida)
			.toPromise()
			.then(results => { this.consultarTiposMedidaProducto() })
			.catch(err => { console.log(err) });

		this.showSuccess('Tipo de medida se ha eliminado satisfactoriamente');

	}

	showDialogToAdd() {
		this.newTipoMedida = true;
		this.tituloDialogo = "Nuevo Tipo de Medida";
		this.tipoMedida = {};
		this.displayDialog = true;
	}

	cerrar() {
		this.tipoMedida = null;
		this.displayDialog = false;
	}

	cloneGrupo(c: TipoMedida): TipoMedida {
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
