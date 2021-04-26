import { Component, OnInit } from '@angular/core';
import { RolModelo } from '../../models/rol'
import { MenusItems } from "../../models/menus-items"
import { Menu } from "../../models/menu"

import { RolesService } from '../../services/roles.service'
import { MenusItemsService } from '../../services/menus-items.service'
import { MessageService, SelectItem } from 'primeng/api';

import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';



@Component({
	selector: 'roles',
	templateUrl: './roles.component.html',
	styleUrls: ['./roles.component.css'],
	providers: [RolesService, MessageService, ConfirmationService] // 
})
export class RolesComponent implements OnInit {

	cant_filas_pag: number = 10;
	rows: number = this.cant_filas_pag;
	primera_fila = 0;
	displayDialog: boolean = false;
	tituloDialogo: string = "";
	Roles: RolModelo[] = [];
	Rol: RolModelo = {};
	cols: any[];
	items: MenuItem[];
	activeItemTab: MenuItem;
	menuTemp: Menu;
	menusAsignables: MenusItems[] = [];
	menuAsignado: MenusItems = {};
	menuItems: SelectItem[] = [];

	constructor(
		private servRoles: RolesService, private messageService: MessageService,
		private confirmationService: ConfirmationService, private servMenus: MenusItemsService
	) {

	}

	ngOnInit() {
		this.actualizarLista();

		//Arreglo usado para aplicar al funcionalidad "Ordenar por columna" de los componentes PrimeNGs
		this.cols = [
			{ field: 'idSegRol', header: 'Nro. Rol' },
			{ field: 'codigo', header: 'Codigo' },
			{ field: 'nombre', header: 'Nombre' },
			{ field: 'fechaAlta', header: 'Fecha registro' },
			{ field: 'estatus', header: 'Estatus' }
		];

		this.items = [
			{ label: 'Perfiles', icon: 'fa fa-fw fa-book', routerLink: "/perfiles" },
			{ label: 'Roles', icon: 'fa fa-fw fa-book', routerLink: "/roles" }
		];

		this.activeItemTab = this.items[2];
	}

	cargarMenus() {

		this.menusAsignables = [];
		this.servMenus.obtenerMenusSonItems().subscribe(
			data => {
				this.menusAsignables = data;
				this.menuItems = [];

				this.menuItems.push({
					label: "Sin asignar",
					value: null
				});

				this.menusAsignables.forEach(modn => {
					this.menuItems.push({
						label: modn.padre + " - " + modn.titulo,
						//value: { idSegMenu: modn.idSegMenu, titulo: modn.titulo }
						value: modn.idSegMenu
					});
				});
			}
		);

	}

	confirmacion(Rol: RolModelo, indice: number) {

		if (Rol.idSegRol == null) {
			this.Rol = null;
			this.Roles.splice(indice, 1);
		} else {
			this.confirmationService.confirm({
				message: "¿Desea Eliminar el registro?",
				accept: () => {
					this.eliminarRol(Rol, indice);
				}
			});
		}
	}

	cerrarDialogo() {
		this.displayDialog = false;
	}


	verDialogo(rol: RolModelo) {

		this.tituloDialogo = "Rol: " + rol.idSegRol;
		this.Rol = rol;
		this.cargarMenus();
		this.menuAsignado = {}
		this.displayDialog = true;
	}

	actualizarLista() {
		this.servRoles.getTodos().subscribe(
			(data: RolModelo[]) => {
				/*data.forEach(rol => {
							rol.idSegRol = parseInt(rol.idSegRol);
							//this.usuarios.push(usuario);
						});*/
				this.Roles = data;
				this.Roles = this.Roles.map(Rol => Object.assign({}, Rol, {
					estatus: (Rol.estatus == 1 ? true : false),
					auditable: (Rol.auditable == 1 ? true : false),
					idSegRol: parseInt(Rol.idSegRol)
				}));
			}
		);
		this.rows = this.cant_filas_pag;
	}

	_editar() { }

	//Manejo de eventos en el p-table --
	handleChange(e, Rol: RolModelo) {
		Rol.estatus = (e.checked == true ? 1 : 0)
	}
	handleChangeAudi(e, Rol: RolModelo) {
		Rol.auditable = (e.checked == true ? 1 : 0)
	}

	onPagination(event: any) {
		this.primera_fila = event.first;
	}

	change(e: any) {
		//window.alert("Algo");
	}
	//----

	setearDatosRol(Rol: RolModelo) {

		if (Rol.codigo == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el codigo' });
			return false;
		}
		if (Rol.nombre == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar nombre' });
			return false;
		}

		// Nuevo Rol
		//
		if (Rol.idSegRol == null) {
			this.servRoles.nuevoRol(Rol).subscribe(data => {
				this.actualizarLista();
			});
			this.displayDialog = false;
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Rol Registrado Satisfactoriamente' });
		} else { //Actualizar

			Rol.estatus = (<any>Rol.estatus == true ? 1 : 0);
			Rol.auditable = (<any>Rol.auditable == true ? 1 : 0);

			this.servRoles.actualizarRol(Rol).subscribe(data => {
				this.actualizarLista();
			});
			this.displayDialog = false;
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Rol Actualizado Satisfactoriamente' });
		}
	}

	nuevoRol() {
		this.cargarMenus();
		this.menuAsignado = {}
		this.tituloDialogo = "Nuevo Rol";
		this.Rol = null;
		this.Rol = {};
		this.displayDialog = true;
	}

	eliminarRol(Rol: RolModelo, indice: number) {

		this.servRoles.eliminarRol(Rol).subscribe(
			(data: RolModelo[]) => {
				this.Rol = null;
				this.actualizarLista();
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro eliminado' });
			}
		);
	}
}
