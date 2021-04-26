import { Component, OnInit } from '@angular/core';
import { PerfilModelo } from '../../models/perfil'
import { RolesAsignados } from '../../models/roles-asignados'
import { RolesPerfiles } from '../../models/roles-perfiles'
import { PerfilesService } from '../../services/perfiles/perfiles.service'
import { RolesPerfilesService } from "../../services/roles-perfiles.service";
import { PerfilesUsuarioService } from "../../services/perfiles-usuario.service"
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
	selector: 'app-perfiles',
	templateUrl: './perfiles.component.html',
	styleUrls: ['./perfiles.component.css'],
	providers: [PerfilesService, MessageService, ConfirmationService]
})

export class PerfilesComponent implements OnInit {

	cant_filas_pag: number = 10;
	rows: number = this.cant_filas_pag;
	primera_fila = 0;
	paginacion: boolean = true;
	Editando: boolean = false;

	Perfiles: PerfilModelo[] = [];
	PerfilesE$: Observable<any[]>;
	Perfil: PerfilModelo = {};
	tieneroles: number = 0;
	nuevoPerfilClon: number = null;

	cols: any[];
	items: MenuItem[];
	activeItemTab: MenuItem;
	tituloDialogo: string = "Descripción del Perfil: ";
	displayDialog: boolean = false;

	constructor(private servPerfiles: PerfilesService, private messageService: MessageService,
		private confirmationService: ConfirmationService, private srvRolesPerfiles: RolesPerfilesService,
		private srvPerfilesUsr: PerfilesUsuarioService, private router: Router) {

	}

	ngOnInit() {
		this.actualizarLista();

		//Arreglo usado para aplicar al funcionalidad "Ordenar por columna" de los componentes PrimeNGs
		this.cols = [
			{ field: 'idSegPerfil', header: 'Nro. Perfil', width: '5%' },
			{ field: 'codigo', header: 'Codigo', width: '5%' },
			{ field: 'nombre', header: 'Nombre', width: '5%' },
			// { field: 'descripcion', header: 'Descripción' },
			{ field: 'fechaAlta', header: 'Fecha registro', width: '5%' },
			{ field: 'estatus', header: 'Estatus', width: '5%' }
		];

		this.items = [
			{ label: 'Perfiles', icon: 'fa fa-fw fa-book', routerLink: "/perfiles" },
			//{label: 'Modulos', icon: 'fa fa-fw fa-book', routerLink: "/modulos"},
			{ label: 'Roles', icon: 'fa fa-fw fa-book', routerLink: "/roles" }
		];

		this.activeItemTab = this.items[0];

	}

	eliminar(perfil: PerfilModelo, indice: number) {

		if (perfil.idSegPerfil == null) {
			this.Perfil = null;
			this.Perfiles.splice(indice, 1);
			this.rows = this.cant_filas_pag;
		} else {
			this.tieneroles = null;
			this.srvRolesPerfiles.getRolesAsignados(perfil.idSegPerfil).subscribe(
				data => {
					this.tieneroles = data.length;
					// console.log("ahora tiene " + this.tieneroles);
					if (this.tieneroles != 0) {
						this.messageService.add({
							key: 'tc', severity: 'info', summary: 'NO PUEDE ELIMINAR PERFIL',
							detail: "El perfil tiene roles asociados. Quite todo rol asociado al perfil",
							life: 6000
						});
						return false;
					}

					this.confirmationService.confirm({
						message: "¿Desea Eliminar el registro?",
						accept: () => {
							this.eliminarPerfil(perfil, indice);
						}

					});
				});
		}

	}

	clonar(perfil_o: PerfilModelo) {

		this.confirmationService.confirm({
			message: "¿Desea CLONAR el registro?",
			accept: () => {
				var cperfil: PerfilModelo;
				var rolesDelPerfil: RolesAsignados[] = [];
				let idclone: number;
				this.nuevoPerfilClon = null;
				idclone = perfil_o.idSegPerfil;
				cperfil = perfil_o;
				cperfil.idSegPerfil = null;
				cperfil.codigo += "(c)";
				cperfil.descripcion += "(c)";
				cperfil.nombre += "(c)";
				cperfil.fechaAlta = null;

				this.servPerfiles.nuevoPerfil(cperfil).subscribe(data => {
					let nuevoIdPerfilClonado: number;
					// console.log("nuevo: " + data["ObjectId"]);
					nuevoIdPerfilClonado = data["ObjectId"];
					// nuevo = data["ObjectId"];
					// this.nuevoPerfilClon = data["ObjectId"]; 
					this.srvRolesPerfiles.getRolesAsignados(idclone).subscribe(
						data => {
							rolesDelPerfil = data;
							// console.table(rolesDelPerfil);
							let crolPerfil: RolesPerfiles;
							rolesDelPerfil.forEach(rol => {
								crolPerfil = { idSegPerfil: nuevoIdPerfilClonado, idSegRol: rol.idSegRol };
								this.srvRolesPerfiles.insertarRolesAPerfil(crolPerfil).subscribe();
								crolPerfil = null;
							});

						});

					this.actualizarLista();
				});
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Perfil Clonado correctamente' });
			}
		});

	}

	actualizarLista() {
		this.servPerfiles.getTodos().subscribe(
			(data: PerfilModelo[]) => {
				data.forEach(perfil => {
					perfil.idSegPerfil = parseInt(perfil.idSegPerfil);
					//this.usuarios.push(usuario);
				});
				this.Perfiles = data;
				this.Perfiles = this.Perfiles.map(perfil => Object.assign({}, perfil, { estatus: (perfil.estatus == 1 ? true : false) }));
			}
		);
		this.rows = this.cant_filas_pag;
	}

	_editar() { this.Editando = true; }

	handleChange(e: any, perfil: PerfilModelo) {
		perfil.estatus = (e.checked == true ? 1 : 0)
		this.Editando = true;
	}

	onPagination(event: any) {
		this.primera_fila = event.first;
	}

	cerrarDialogo() {
		this.displayDialog = false;
	}

	verDialogo(perfil: PerfilModelo) {
		this.tituloDialogo = "Perfil nro: " + perfil.idSegPerfil;
		this.Perfil = perfil;

		this.displayDialog = true;
	}

	setearDatosPerfil(perfil: PerfilModelo, editando: boolean) {
		//Validaciones
		//console.log(editando);
		//if (this.Editando == true) {
		if (perfil.codigo == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el codigo' });
			return false;
		}
		if (perfil.nombre == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar nombre' });
			return false;
		}

		//Nuevo
		perfil.estatus = (<any>perfil.estatus == true ? 1 : 0);
		if (perfil.idSegPerfil == null) {
			console.table(perfil);
			this.servPerfiles.nuevoPerfil(perfil).subscribe(data => {
				this.actualizarLista();
			});
			//this.Perfil = perfil;
			this.displayDialog = false;
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Perfil Registrado Satisfactoriamente' });
		} else { // Actualizar


			this.servPerfiles.actualizarPerfil(perfil).subscribe(data => {
				this.actualizarLista();
			}, error => { this.messageService.add({ key: 'tc', severity: 'error', summary: 'ERROR: ' }); }
			);
			this.displayDialog = false;
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Perfil Actualizado Satisfactoriamente' });
		}
		//}
		//this.Editando = false;
	}

	nuevoPerfil() {
		this.tituloDialogo = "Nuevo Perfil";
		this.Perfil = null;
		this.Perfil = {};
		this.displayDialog = true;
		//this.Perfiles.splice(this.primera_fila + this.rows, 0, this.Perfil);
		//this.rows += 1;
	}



	irRolesModulos($idperfil: number) {
		this.router.navigate(["perfilrolmod", $idperfil]);
	}

	eliminarPerfil(perfil: PerfilModelo, indice: number) {
		perfil.estatus = (<any>perfil.estatus == true ? 1 : 0);
		this.srvPerfilesUsr.getPerfilesAsignadosPorPerfil(perfil.idSegPerfil).subscribe(
			data2 => {
				if (data2.length > 0) {
					this.messageService.clear();
					this.Perfil = null;
					this.messageService.add({ key: 'tc', severity: 'error', summary: 'El perfil esta asociado a un usuario o tiene asignados roles. Verifique primero antes de eliminar' });
					return;
				} else {
					this.servPerfiles.eliminarPerfil(perfil).subscribe(
						data => {
							this.messageService.clear();
							this.Perfil = null;
							this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro eliminado' });
							this.actualizarLista();
						}
					);
				}
			}
		);
		/*this.servPerfiles.eliminarPerfil(perfil).subscribe(
		  data => {        
			this.messageService.clear();
			this.Perfil = null;
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro eliminado' });
			this.actualizarLista();
		  }
		);*/

	}


}
