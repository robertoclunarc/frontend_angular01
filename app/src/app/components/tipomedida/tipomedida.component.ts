import { Component, OnInit } from '@angular/core';

import { MessageService, SortEvent, SelectItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { TipomedidaService } from '../../services/tipomedida.service';
import { Tipomedida } from 'src/app/models/tipomedida';





@Component({
	selector: 'app-tipomedida',
	templateUrl: './tipomedida.component.html',
	styleUrls: ['./tipomedida.component.scss'],
	providers: [TipomedidaService, MessageService, ConfirmationService]
})
export class TipomedidaComponent implements OnInit {

	primera_fila = 0;
	tmedidas: Tipomedida[] = [];
	tmedida: Tipomedida = {};
	displayDialog: boolean;
	tituloDialogo: string = "";
	cols: any[]
	idAdmTipoMedida: number;
	fechaAlta = Date;
	nombre: string;
	descripcion: string;
	orden: number;



	constructor(private servtipomedida: TipomedidaService, private messageService: MessageService,
		private confirmationService: ConfirmationService) {
	}

	ngOnInit() {
		this.actualizarlista();
		//para ser usado por ng
		this.cols = [
			{ field: 'idAdmTipoMedida', header: 'Id', width: '10%' },
			{ field: 'nombre', header: 'Nombre', width: '20%' },
			{ field: 'descripcion', header: 'Descripción', width: '40%' },
			//{ field: 'orden', header: 'Clasificación' },
			{ field: 'fechaAlta', header: 'Fecha de Registro', width: '20%' },
		];


	}
	actualizarlista() {
		this.servtipomedida.consultarTodos()
			.then(result => {
				this.tmedidas = result;
				//console.log(this.tmedidas);
			});

	}
	verdialogo(tipo: Tipomedida) {
		this.displayDialog = true;
		this.tmedida = tipo;
		this.tituloDialogo = "Tipo Medida: " + this.tmedida.idAdmTipoMedida;


	}

	cerrarDialogo() {
		this.displayDialog = false;
		this.actualizarlista();

	}

	verificar() {


		if (this.tmedida.idAdmTipoMedida == null) {
			console.log(this.tmedida);
			this.servtipomedida.registrar(this.tmedida)
				.then(tipo => {
					this.tmedida = tipo;
					this.actualizarlista();
				});

			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Nueva clasificación añadida' });


		} else {
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados satisfactoriamente' });

			this.servtipomedida.actualizar(this.tmedida)
				.then(tipo => {
					this.tmedida = tipo;
					this.actualizarlista();
				});


		};

		this.displayDialog = false;
	}
	//Manejo de eventos en el p-table --

	onPagination(event: any) {
		this.primera_fila = event.first;
	}

	change(e: any) {
		//window.alert("Algo");
	}
	//----
	nuevotipo() {
		this.tituloDialogo = "Nueva Clasificación";
		this.tmedida = null;
		this.tmedida = {};
		this.displayDialog = true;
	}

	confirmacion(indice: number) {

		this.confirmationService.confirm({
			message: "¿Desea Eliminar el registro?",
			accept: () => {
				this.servtipomedida.eliminar(indice).then(data => {
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro eliminado' });
					this.actualizarlista();
				});

			}
		});

	}

}

