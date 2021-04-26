import { Component, OnInit } from '@angular/core';

import { AreaNegocioModelo } from "../../models/area-negocio";
import { AreaNegocioService } from "../../services/area-negocio.service";
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
	selector: 'app-area-negocio',
	templateUrl: './area-negocio.component.html',
	styleUrls: ['./area-negocio.component.scss'],
	providers: [AreaNegocioService, ConfirmationService, MessageService]
})
export class AreaNegocioComponent implements OnInit {

	cols: any[];
	areasNegocios: AreaNegocioModelo[] = [];
	areaNeg: AreaNegocioModelo = {};
	tituloDialogo: string = "";
	displayDialogo: boolean = false;

	constructor(private srvAreaNegocio: AreaNegocioService, private messageService: MessageService,
		private confirmationService: ConfirmationService) { }

	ngOnInit() {

		this.cols = [
			{ field: 'idGenAreaNegocio', header: 'Id Area' },
			{ field: 'codigo', header: 'Codigo' },
			{ field: 'nombre', header: 'Nombre' },
			{ field: 'descripcion', header: 'Desscripcion' },
			{ field: 'fechaAlta', header: 'Fecha registro' },

		];

		this.actuliazarLista();

	}

	async actuliazarLista() {
		/*this.srvAreaNegocio.getAll2()
		.toPromise()
		.then(data => {
			this.areasNegocios = data;
		});*/



		this.areasNegocios = await this.srvAreaNegocio.getAll3();
	}

	edit(area: AreaNegocioModelo) {
		this.areaNeg = area;
		this.tituloDialogo = "Editar Area de Negocio";
		this.displayDialogo = true;
	}

	remove(area: AreaNegocioModelo) {
		this.confirmationService.confirm({
			message: "¿Desea Eliminar el registro?",
			accept: () => {
				this.srvAreaNegocio.eliminarAreaNegocio(area).then(
					() => {
						this.actuliazarLista();
						this.messageService.clear();
						this.messageService.add({ key: 'tc', severity: 'success', summary: 'Area eliminada' });
					}
				);

			}
		});
	}

	nuevo() {
		this.tituloDialogo = "Nueva Area de Negocio";
		this.displayDialogo = true;
		this.areaNeg = {};
	}

	async guardar() {
		//console.log(this.areaNeg);
		if (this.areaNeg.idGenAreaNegocio == null) {
			let ultimo_usr = await this.srvAreaNegocio.nuevoAreaNegocio2(this.areaNeg);
			console.log("el ultimo id de la data: " + ultimo_usr["ObjectId"]);
			
			/*this.srvAreaNegocio.nuevoAreaNegocio(this.areaNeg)
			.then(
				data => {
									
					this.actuliazarLista();
					this.cerrar()
					return data["ObjectId"];
				}
			)
			.then(idultimo =>{
				console.log("el ultimo id de la data: " + idultimo);
			});*/
			this.actuliazarLista();
			this.cerrar()
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Area ingresada Satisfactoriamente' });
		} else {
			this.srvAreaNegocio.actualizarAreaNegocio(this.areaNeg).then(
				data => {
					//console.log(data);
					this.actuliazarLista();
					this.cerrar()
				}
			);
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Area Actualizada Satisfactoriamente' });
		}

	}

	cerrar() {
		this.tituloDialogo = "";
		this.displayDialogo = false;
		this.areaNeg = {};
	}

}
