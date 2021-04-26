import { Component, OnInit } from '@angular/core';

import { EmpresaCompras } from "../../models/empresa-compras";
import { GerenciasModelo } from "../../models/gerencias";
import { AreaNegocioModelo } from "../../models/area-negocio";
import { EmpreGerenArea } from "../../models/empre-geren-area";

import { SelectItem, ConfirmationService, MessageService } from 'primeng/api';

import { EmpresacomprasService } from "../../services/empresacompras.service";
import { EmpreGerenAreaService } from "../../services/empre-geren-area.service";
import { AreaNegocioService } from "../../services/area-negocio.service";
import { GerenciasService } from "../../services/gerencias.service";

@Component({
	selector: 'app-empre-geren-area',
	templateUrl: './empre-geren-area.component.html',
	styleUrls: ['./empre-geren-area.component.scss'],
	providers: [ConfirmationService, MessageService]
})
export class EmpreGerenAreaComponent implements OnInit {

	datosEGA: EmpreGerenArea[] = [];

	empresas: EmpresaCompras[] = [];
	empresaSeleccionada: EmpresaCompras = {};
	empresasItems: SelectItem[] = [];

	areasNegocio: AreaNegocioModelo[] = [];
	areaSeleccionada: AreaNegocioModelo = {};
	areasItems: SelectItem[] = [];

	gerencias: GerenciasModelo[] = [];
	gerenciaSeleccionada: GerenciasModelo = {};
	gerenciasItems: SelectItem[] = [];

	cols: any = [];

	constructor(private svrEmpresas: EmpresacomprasService, private svrGerencias: GerenciasService, private svrAreas: AreaNegocioService,
		private svrEGA: EmpreGerenAreaService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

	ngOnInit() {
		this.cols = [
			{ field: 'nombre_empresa', header: 'Empresa', width: "30%" },
			{ field: 'nombre_gerencia', header: 'Gerencia', width: "20%" },
			{ field: 'nombre_area', header: 'Area de Negocio', width: "30%" }
		];

		this.svrEmpresas.getTodos().then(data => {
			this.empresas = data;

			/*this.empresasItems = [];
			this.empresas.forEach(empresa => {
				this.empresasItems.push({label: empresa.IdComprasEmpresa, value: empresa.nombre_empresa});
			}); */
		});

		this.svrGerencias.getTodos().then(data => {
			this.gerencias = data;
		});

		this.svrAreas.getAll().then(data => {
			this.areasNegocio = data;
		});

		this.cagarListaEGA()

	}

	cagarListaEGA() {
		this.svrEGA.getAll().then(data => {
			this.datosEGA = data;
		});
	}

	nuevaRelacion() {
		if (this.empresaSeleccionada.IdComprasEmpresa == null || this.gerenciaSeleccionada.idConfigGerencia == null ||
			this.areaSeleccionada.idGenAreaNegocio == null) {

			this.svrEGA.consultarIngresadas(this.empresaSeleccionada.IdComprasEmpresa, this.gerenciaSeleccionada.idConfigGerencia
				, this.areaSeleccionada.idGenAreaNegocio).then(data => {
					if (data.length > 0) {
						//console.log(file.name.indexOf("#"));
						this.messageService.clear();
						this.messageService.add({ key: 'tc', severity: 'error', summary: 'Datos ya ingresados' });
					} else {
						
						let newEga: EmpreGerenArea = {};
						newEga.IdComprasEmpresa = this.empresaSeleccionada.IdComprasEmpresa;
						newEga.idConfigGerencia = this.gerenciaSeleccionada.idConfigGerencia;
						newEga.idGenAreaNegocio = this.areaSeleccionada.idGenAreaNegocio;
						
						this.svrEGA.insertarEGA(newEga).then(data => {
							this.messageService.clear();
							this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro insertado satisfactoriamente' });
							this.cagarListaEGA();
						});

						//this.svrEGA.insertarEGA().then;	

					}
				});

		}
	}

	eliminar(ega: EmpreGerenArea) {

		this.confirmationService.confirm({
			message: "¿Desea eliminar el registro?",
			accept: () => {
				this.svrEGA.borrarEGA(ega).then(data => {
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro eliminado satisfactoriamente' });
					this.cagarListaEGA();
				});
			},
			reject: () => { return false; }
		});
	}

	resetear() {
		this.areaSeleccionada = {};
		this.empresaSeleccionada = {};
		this.gerenciaSeleccionada = {};
	}

}
