import { Component, OnInit } from '@angular/core';

import { EmpresaCompras } from "../../models/empresa-compras";
import { EmpresacomprasService } from "../../services/empresacompras.service";

import { MessageService, ConfirmationService } from 'primeng/api';

import { MenuItem } from "primeng/api";

@Component({
	selector: 'app-empresas-compras',
	templateUrl: './empresas-compras.component.html',
	styleUrls: ['./empresas-compras.component.scss'],
	providers: [MessageService, ConfirmationService]
})
export class EmpresasComprasComponent implements OnInit {

	cols: any[];
	EmpresasDeCompras: EmpresaCompras[] = [];
	empresa: EmpresaCompras = {};

	items: MenuItem[];
	activeItemTab: MenuItem;

	mostrarDialogo: boolean = false;

	constructor(private svrEmpresasCompras: EmpresacomprasService, private messageService: MessageService,
		private confirmationService: ConfirmationService) { }

	ngOnInit() {

		this.cols = [
			{ field: 'IdComprasEmpresa', header: 'Id', width: "5%" },
			{ field: 'nombre_empresa', header: 'Nombre', width: "25%" },
			{ field: 'rif', header: 'RIF', width: "10%" },
			{ field: 'direccion_fiscal', header: 'Dirección Fiscal', width: "40%" },
			{ field: 'cerrada', header: 'Cerrada', width: "5%" }
		];

		this.items = [
			{ label: 'Empresas', icon: 'fa fa-fw fa-book', routerLink: "/comprasempresas" },
			{ label: 'Gerencias', icon: 'fa fa-fw fa-book', routerLink: "/gerencias" },
			{ label: 'Areas de Negocio', icon: 'fa fa-fw fa-book', routerLink: "/perfiles" },
			{ label: 'C. Costos', icon: 'fa fa-fw fa-book', routerLink: "/roles" },
			{ label: 'Empresa - Geren - Area', icon: 'fa fa-fw fa-book', routerLink: "/roles" },
			{ label: 'Empresa - Geren - C.C.', icon: 'fa fa-fw fa-book', routerLink: "/roles" }
		];

		this.activeItemTab = this.items[0];

		this.cargarLista();

	}

	cargarLista() {
		this.svrEmpresasCompras.getAllconCerradas().then(
			data => {
				this.EmpresasDeCompras = data;
				this.EmpresasDeCompras = this.EmpresasDeCompras.map(empre => Object.assign({}, empre, { cerrada: (empre.cerrada == 1 ? true : false) }));
				// console.table(this.Gerencias);
			}
		);
	}

	nuevo() {
		this.empresa = {};
		this.mostrarDialogo = true;
	}

	verDialogo(gerenciaAct: EmpresaCompras) {
		this.empresa = {};
		this.empresa = gerenciaAct;
		console.log(gerenciaAct);
		//this.empresa = gerenciaAct;
		this.mostrarDialogo = true;
	}

	cerrarDialogo() {
		this.mostrarDialogo = false;
	}

	handleChange(e: any, perfil: EmpresaCompras) {
		perfil.cerrada = (e.checked == true ? 1 : 0);
		//this.Editando = true;
	}

	guardar() {
		if (this.empresa.nombre_empresa == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el nombre' });
			return false;
		}

		if (this.empresa.rif == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el rif' });
			return false;
		}

		if (this.empresa.direccion_fiscal == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar la dirección' });
			return false;
		}

		console.table(this.empresa);
		//	return false;
		this.empresa.cerrada = (this.empresa.cerrada == true ? 1 : 0);
		if (this.empresa.IdComprasEmpresa == null) {
			this.svrEmpresasCompras.nuevoEmpresaCompras(this.empresa).then(
				data => {
					this.mostrarDialogo = false;
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'success', summary: 'Empresa registrada satisfactoriamente' });
					this.cargarLista();
				}
			);

		} else {
			this.svrEmpresasCompras.actualizarEmpresaCompras(this.empresa).then(
				data => {
					this.mostrarDialogo = false;
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'success', summary: 'Empresa Actualizada satisfactoriamente' });
					this.cargarLista();
				}
			);

		}


	}

	eliminar(gere: EmpresaCompras, i) {
		this.confirmationService.confirm({
			message: "¿Esta seguro de eliminar esta gerencia?",
			accept: () => {
				this.svrEmpresasCompras.eliminarEmpresaCompras(gere).then(
					data => { this.cargarLista(); }
				);
			},
			reject: () => {
				return false;
			}
		});

	}

}
