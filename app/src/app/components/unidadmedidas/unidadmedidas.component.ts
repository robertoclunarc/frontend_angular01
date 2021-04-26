import { Component, OnInit } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { UnidadmedidasService } from '../../services/unidadmedidas.service';
import { Unidadmedidas } from 'src/app/models/unidadmedidas';

import { MenusItemsService } from '../../services/menus-items.service'
import { TipomedidaService } from "../../services/tipomedida.service"


@Component({
	selector: 'unidadmedidas',
	templateUrl: './unidadmedidas.component.html',
	styleUrls: ['./unidadmedidas.component.scss'],
	providers: [UnidadmedidasService, ConfirmationService, MessageService]
})
export class UnidadmedidasComponent implements OnInit {

	Umedidas: Unidadmedidas[] = [];
	Myumedida: Unidadmedidas;
	cols: any[];
	primera_fila = 0;
	displayDialog: boolean;
	tituloDialogo: string = "";
	nombre: string;
	abrev: string;
	orden: number;
	idAdmTipoMedida: number;
	_unidad: any;
	tiposasig: Unidadmedidas[] = [];
	menuItems: SelectItem[] = [];
	seleccionado: SelectItem;

	constructor(private UMservice: UnidadmedidasService, private confirmationservice: ConfirmationService,
		private messageservice: MessageService, private servMenus: MenusItemsService,
		private svrTiposU: TipomedidaService) {

	}

	ngOnInit() {

		this.actualizarlista();
		this.llenarComboTipos();

		//Arma la tabla de ngPrime
		this.cols = [
			{ field: 'idAdmUnidadMedida', header: 'Id', width: '8%' },
			{ field: 'nombre', header: 'Nombre', width: '20%' },
			{ field: 'abrev', header: 'Abreviatura', width: '16%' },
			{ field: 'nombre_tipo', header: 'Clasificación', width: '15%' },
			{ field: 'fechaAlta', header: 'Fecha de Registro', width: '18%' },
		];



	}

	/*cargarDropdown() {
		this.UMservice.consultarTodos()
			.then(data => {
				this.table = data;
			});
	}*/


	actualizarlista() {

		this.UMservice.consultarTodos()
			.then(result => {
				this.Umedidas = result;
			})
	}

	llenarComboTipos() {

		this.svrTiposU.consultarTodos()
			.then(data => {
				this.menuItems = [];
				//this.menuItems.push({ label: "Seleccione", value: null });
				data.forEach(tipo => {
					this.menuItems.push({ label: tipo.nombre, value: tipo.idAdmTipoMedida });

				});
				//this.menuItems = data;
				//console.log(this.menuItems);
			})
	}

	verdialogo(_unidad: Unidadmedidas, id: number) {
		this.llenarComboTipos();
		this.Myumedida = {};
		this.Myumedida = _unidad;
		this.tituloDialogo = "Unidad de Medida: " + this.Myumedida.idAdmUnidadMedida;
		this.displayDialog = true;

	}

	cerrarDialogo() {
		this.displayDialog = false;
		this.actualizarlista();

	}

	nuevotipo() {
		this.displayDialog = true;

		this.tituloDialogo = "Nueva Clasificación";
		this.Myumedida = null;
		this.Myumedida = {};

	}
	verificar() {

		if (this.Myumedida.idAdmUnidadMedida == null) {
			this.messageservice.add({ key: 'tc', severity: 'success', summary: 'Nueva clasificación añadida' });
			this.UMservice.nuevaUmedida(this.Myumedida)
				.then(tipo => {
					this.Myumedida = tipo;
					this.actualizarlista()
				});



		} else {
			this.messageservice.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados satisfactoriamente' });

			this.UMservice.actualizar(this.Myumedida)
				.then(tipo => {
					this.Myumedida = tipo;
					this.actualizarlista();
				});


		}

		this.displayDialog = false;
		this.actualizarlista();

	}

	//Manejo de eventos en el p-table --

	onPagination(event: any) {
		this.primera_fila = event.first;
	}

	change(e: any) {
		//window.alert("Algo");
	}
	//----
	confirmacion(id: number) {

		this.confirmationservice.confirm({
			message: "¿Desea Eliminar el registro?",
			accept: () => {
				this.UMservice.eliminarUmedida(id).then(data => {
					this.messageservice.clear();
					this.messageservice.add({ key: 'tc', severity: 'success', summary: 'Registro eliminado' });
					this.actualizarlista();
				});

			}
		});

	}
}