import { Component, OnInit } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
//import { ConfigGerencias } from '../../models/config-gerencias';
import { MessageService } from 'primeng/api';

import { AdmAreasTrabajo } from '../../models/adm-areas-trabajo';
import { RelacionAreaGcia } from '../../models/relacion-area-gcia';
import { GerenciasService } from 'src/app/services/gerencias.service';
import { AreaNegocioService } from 'src/app/services/area-negocio.service';

import { RelacionAreasGerenciasService } from '../../services/relacion-areas-gerencias.service';
import { GerenciasModelo } from '../../models/gerencias';
import { AreaNegocioModelo } from '../../models/area-negocio';


@Component({
	selector: 'app-areas-gerencias',
	templateUrl: './areas-gerencias.component.html',
	styleUrls: ['./areas-gerencias.component.scss'],
	providers: [RelacionAreasGerenciasService, ConfirmationService, MessageService]
})
export class AreasGerenciasComponent implements OnInit {

	AreasTrabajo: AdmAreasTrabajo[] = [];
	area: AdmAreasTrabajo = {};
	Relaciones: RelacionAreaGcia[] = [];


	relacion: RelacionAreaGcia = {};
	todasGerencias: GerenciasModelo[];
	gerencia: GerenciasModelo = {};
	areasNegocios: AreaNegocioModelo[] = [];
	areaNegocioSelected: AreaNegocioModelo = {};

	menuItems: SelectItem[] = [];
	cols: any[];
	primera_fila = 0;
	displayDialog: boolean;
	tituloDialogo: string = "";
	item: string;
	items: SelectItem[];
	gerencias_load: any[];
	gere: any;

	constructor(private relacionATG: RelacionAreasGerenciasService, private srvGerencia: GerenciasService,
		private svrAreaNegocio: AreaNegocioService,
		private confirmationservice: ConfirmationService, private messageservice: MessageService) {

	}

	ngOnInit() {
		this.DisplayRelacionAtG();
		this.displayGerencias();


		this.cols = [
			{ field: 'idAreaTrabajo', header: 'Id', width: '5%' },
			{ field: 'nombre', header: 'Area de Trabajo', width: '20%' },
			{ field: 'fechaAlta', header: 'Ultima Modificación', width: '15%' },
			{ field: 'areaNegocio', header: 'Area de Negocio', width: '20%' }
		];

	}


	DisplayRelacionAtG() {

		this.AreasTrabajo = [];
		this.relacionATG.consultarArea()
			.then(result => {
				this.AreasTrabajo = result;
				//console.log(this.AreasTrabajo);
			});

	}

	displayGerencias() {
		this.relacionATG.consultarGerencias()
			.then(data => {
				this.todasGerencias = data;
				//console.log(this.todasGerencias);
			})
	};

	cargarAreaNegocios() {
		this.svrAreaNegocio.getAll3()
			.then(data => {
				this.areasNegocios = data;
			})

	}

	async listbox(id: number) {

		let result: RelacionAreaGcia[] = [];
		let arre_rela: any[] = [];

		//Guardar en el arreglo "arre_rela" solamente los id de cada gerencia, transformacion 
		result = await this.relacionATG.GerenciasporArea(id);
		result.forEach(rela => {
			arre_rela.push(rela.idConfigGerencia);
		});

		this.todasGerencias = await this.srvGerencia.getTodos();

		//recorro y filtro todas las gerencias
		this.gerencias_load = this.todasGerencias.filter(gere => {
			return arre_rela.indexOf(gere.idConfigGerencia) != -1; //<- este es el criterio de filtrado 
		});


	}

	//Manejo de eventos en el p-table --

	onPagination(event: any) {
		this.primera_fila = event.first;
	}

	change(_e: any) {
		//window.alert("Algo");
	}

	editar(data: AdmAreasTrabajo) {
		this.displayGerencias();
		this.cargarAreaNegocios();
		//this.menuItems = [];
		this.area = {};
		this.area = data;
		//console.log("area:", this.area);
		this.tituloDialogo = "Area de Trabajo: " + this.area.idAreaTrabajo
		this.listbox(this.area.idAreaTrabajo);
		this.areaNegocioSelected.idGenAreaNegocio = this.area.idGenAreaNegocio;
		this.areaNegocioSelected.nombre = this.area.areaNegocio;
		// this.consultarGerenciasRela(this.area.idAreaTrabajo);
		this.displayDialog = true;


	};

	cerrarDialogo() {

		this.displayDialog = false;
		//this.AreasTrabajo = [];
		this.gerencias_load = [];
		//this.DisplayRelacionAtG();

	};

	nuevaArea() {
		//this.listbox();
		this.tituloDialogo = "Registrar Nueva Area de Trabajo";
		this.displayDialog = true;
		this.Relaciones = [];
		this.area = {};
		this.displayGerencias();
		//this.cargarAreaNegocios();
	}

	eliminar(id: number) {
		this.confirmationservice.confirm({
			message: "¿Desea Eliminar el Area de Trabajo?",
			accept: () => {
				this.relacionATG.eliminarAT(id).then(data => {

					this.relacionATG.eliminaRelacionATG(id).then();
					//this.AreasTrabajo=[];
					this.Relaciones = [];
					this.area = {};
					this.messageservice.clear();
					this.messageservice.add({ key: 'tc', severity: 'success', summary: 'Registros Eliminados' });
					this.DisplayRelacionAtG();
				});
				//this.AreasTrabajo = [];

			}
		})

		//this.cerrarDialogo();

	}

	isEmpty(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	async guardar(area: AdmAreasTrabajo) {


		if (this.area.nombre == null) {
			this.messageservice.clear();
			this.messageservice.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el nombre area' });
			return false;
		}
		if (this.isEmpty(this.areaNegocioSelected) || this.areaNegocioSelected == null || this.areaNegocioSelected == undefined) {
			this.messageservice.clear();
			this.messageservice.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar una area de Negocio' });
			return false;
		}

		if (this.gerencias_load == undefined || this.gerencias_load == null || this.gerencias_load.length == 0) {
			this.messageservice.clear();
			this.messageservice.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar al menos una(1) gerencia' });
			return false;
		}

		if (area.idAreaTrabajo == null) {
			let ultimo = await this.relacionATG.nuevaAT({ nombre: area.nombre, idGenAreaNegocio: this.areaNegocioSelected.idGenAreaNegocio });

			//return true};

			this.gerencias_load.forEach(data => {
				this.relacionATG.nuevaATG({
					idConfigGerencia: data.idConfigGerencia,
					idAreaTrabajo: ultimo["ObjectId"] //ultimo.idConfigGerencia 
				}).then();
			});

			this.messageservice.clear();
			this.messageservice.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados satisfactoriamente' });
			this.cerrarDialogo();
			this.DisplayRelacionAtG();

		} else {

			await this.relacionATG.actualizarAT({
				idAreaTrabajo: area.idAreaTrabajo,
				nombre: area.nombre, 
				idGenAreaNegocio: this.areaNegocioSelected.idGenAreaNegocio
			})
			await this.relacionATG.eliminaRelacionATG(area.idAreaTrabajo);

			this.gerencias_load.forEach(data => {
				this.relacionATG.nuevaATG({
					idConfigGerencia: data.idConfigGerencia,
					idAreaTrabajo: area.idAreaTrabajo
				}).then();

			});

			this.messageservice.clear();
			this.messageservice.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados satisfactoriamente' });
			this.cerrarDialogo();
			this.DisplayRelacionAtG();
		};

	}


}

