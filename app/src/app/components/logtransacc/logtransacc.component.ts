import { Component, OnInit } from '@angular/core';
import { MenuUsuario } from 'src/app/models/menu';

import { MenuService } from "../../services/menu.service";
import { RolesService } from 'src/app/services/roles.service';
import { RolModelo } from 'src/app/models/rol';
import { TipoAcciones } from 'src/app/models/tipo-acciones';
import { MessageService } from 'primeng/api';
import { LogTransacService } from 'src/app/services/logtransac.service';
import { LogTransacModelo } from 'src/app/models/log';

@Component({
	selector: 'app-logtransacc',
	templateUrl: './logtransacc.component.html',
	styleUrls: ['./logtransacc.component.scss'],
	providers: [MessageService]
})
export class LogtransaccComponent implements OnInit {
	es: any;
	currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

	menus: MenuUsuario[] = [];
	aux_menus: MenuUsuario[] = [];
	selectedMenu: MenuUsuario = {};

	roles: RolModelo[] = [];
	rolSelected: RolModelo = {};

	tipoAcciones: TipoAcciones[] = [];
	tipoaccSelected: TipoAcciones = {};

	rangeDates: Date[];
	cols: any;

	logs: LogTransacModelo[] = [];
	datosVisibles = false;
	loading: boolean = false;

	constructor(
		private svrLog: LogTransacService,
		private svrMenus: MenuService,
		private svrRoles: RolesService,
		private messageService: MessageService
	) { }

	ngOnInit() {
		this.es = {
			firstDayOfWeek: 1,
			dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
			dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
			dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
			monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
			monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
			today: 'Hoy',
			clear: 'Borrar'
		}

		this.cols = [
			{ field: 'idLogTransac', header: 'Nro. Trans', witdh: "10%", display: "true" },
			{ field: 'fechaRegistro', header: 'Fecha registro' },
			{ field: 'modulo', header: 'Modulo' },
			{ field: 'ipPc', header: 'Ip Origen' },
			{ field: 'usuario', header: 'Usuario' },
			{ field: 'tipo_accion', header: 'Tipo de accion' },
			{ field: 'observacion', header: 'Detalle de la Accion' },
		];


		//this.menus = await this.svrMenus.getMenuUserByIdP(2);

		this.svrMenus.getMenuUserByIdP(this.currentUser.idSegUsuario)
			.then(result => {

				/* result.forEach(nodoMenu => {
					this.seterMenuConArbol(nodoMenu);
				});
				this.menus = this.aux_menus; */

				this.menus = result;
			});

		this.svrRoles.getTodosP()
			.then(result => {
				this.roles = result;
			});

		this.svrRoles.getTiposAcciones()
			.then(result => {
				this.tipoAcciones = result;
			});
		//console.log(this.menus);
	}

	seterMenuConArbol(menuNode) {

		if (!menuNode.children) {
			return menuNode;
		} else {
			let hijos = menuNode.children;
			menuNode.children = [];
			this.aux_menus.push(menuNode);
			hijos.forEach(hijo => {
				this.seterMenuConArbol(hijo);
			})

			//this.seterMenuConArbol(menuNode.children);
		}

	}

	public isEmpty(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}

		return JSON.stringify(obj) === JSON.stringify({});
	}

	async buscarData(e) {
		/* console.log("Menu Seleccionado: ", this.selectedMenu);
		console.log("Accion: ", this.tipoaccSelected);
		console.log("Rango: ", this.rangeDates); */

		/* console.log("Selecionado", this.selectedMenu);
		return false; */


		let desde = "";
		let hasta = "";

		if (this.isEmpty(this.selectedMenu)) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar un Modulo' });
			return false;
		}

		if (this.rangeDates) {
			let monthdesde: string = ((this.rangeDates[0].getMonth() + 1) < 10 ? `0${this.rangeDates[0].getMonth() + 1}` : (this.rangeDates[0].getMonth() + 1).toString());
			let monthhasta: string = ((this.rangeDates[1].getMonth() + 1) < 10 ? `0${this.rangeDates[1].getMonth() + 1}` : (this.rangeDates[1].getMonth() + 1).toString());
			
			let diadesde: string = (this.rangeDates[0].getDate() < 10 ? `0${this.rangeDates[0].getDate()}` : (this.rangeDates[0].getDate()).toString());
			let diahasta: string = (this.rangeDates[1].getDate() < 10 ? `0${this.rangeDates[1].getDate()}` : (this.rangeDates[1].getDate()).toString());
			//monthdesde = 
			//desde = `${this.rangeDates[0].getFullYear()}-${this.rangeDates[0].getMonth() + 1}-${this.rangeDates[0].getDate()}`;
			//desde = `${this.rangeDates[0].getFullYear()}-${monthdesde}-${this.rangeDates[0].getDate()}`;
			//hasta = `${this.rangeDates[1].getFullYear()}-${monthhasta}-${this.rangeDates[1].getDate()}`;
			desde = `${this.rangeDates[0].getFullYear()}-${monthdesde}-${diadesde}`;
			hasta = `${this.rangeDates[1].getFullYear()}-${monthhasta}-${diahasta}`;
			//console.log("Desde hasta:", desde, hasta);
		}

		/* this.svrLog.getTransacc(this.selectedMenu.idSegMenu, this.tipoaccSelected.idTipoAccion, this.rolSelected.idSegRol)
			.then( result => {
				this.logs = result;
				console.log(this.logs);
			}); */


		this.datosVisibles = true;
		this.loading = true;
		//console.log("Menu: ", this.selectedMenu.idSegMenu);

		this.logs = await this.svrLog.getTransacc(this.selectedMenu.idSegMenu, (this.tipoaccSelected == undefined ? -1 : this.tipoaccSelected.idTipoAccion),
			(this.rolSelected == undefined ? -1 : this.rolSelected.idSegRol), (desde != "" ? desde : -1), (hasta != "" ? hasta : -1));
		this.loading = false;

		//until = this.rangeDates[1].getFullYear() + '-' + (this.rangeDates[1].getMonth() + 1) + '-' + this.rangeDates[1].getDate();
	}

}
