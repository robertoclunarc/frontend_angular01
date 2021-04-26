import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user'
import { Menu } from "../../models/menu"
import { RolesAsignadosUsrModelo } from "../../models/roles-asignados-usr";
import { RolesUsuariosModelo } from "../../models/roles-usuarios";

import { UserService } from '../../services/user.service'
import { MessageService, SortEvent, SelectItem } from 'primeng/api';
import { RolesUsuariosService } from '../../services/roles-usuarios.service'
import { PerfilesUsuarioService } from '../../services/perfiles-usuario.service'

import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { PerfilesAsignadosModelo } from 'src/app/models/perfiles-asignados';
import { PerfilesUsuarioModelo } from 'src/app/models/perfiles-usuario';



@Component({
	selector: 'app-usuarios',
	templateUrl: './usuarios.component.html',
	styleUrls: ['./usuarios.component.css'],
	providers: [UserService, MessageService, ConfirmationService, RolesUsuariosService, PerfilesUsuarioService]
})
export class UsuariosComponent implements OnInit {

	cant_filas_pag: number = 10;
	rows: number = this.cant_filas_pag;
	primera_fila = 0;
	displayDialog: boolean = false;

	tituloDialogo: string = "";
	rolesAsignados: RolesAsignadosUsrModelo[] = [];

	Usuarios: User[] = [];
	Usuario: User = {};

	usuarios: any[] = [];

	cols: any[];

	items: MenuItem[];
	menuTemp: Menu;

	constructor(private servUsuarios: UserService, private messageService: MessageService,
		private confirmationService: ConfirmationService, private router: Router, private srvRolesUsuarios: RolesUsuariosService
		, private srvPerfilesUsuarios: PerfilesUsuarioService) { }

	ngOnInit() {
		this.cols = [
			{ field: 'idSegUsuario', header: 'Id. usuario' },
			{ field: 'primerNombre', header: 'Nombre Completo' },
			{ field: 'usuario', header: 'Usuario' },
			//{ field: 'descripcion', header: 'Descripción' },
			{ field: 'fechaAlta', header: 'Fecha registro' },
			{ field: 'estatus', header: 'Estatus' }
		];
		this.actualizarLista();

	}

	confirmacion(usuario: User, indice: number) {

		if (usuario.idSegUsuario == null) {
			this.Usuario = null;
			this.Usuarios.splice(indice, 1);
		} else {
			this.confirmationService.confirm({
				message: "¿Desea Eliminar el registro?",
				accept: () => {
					this.eliminar(usuario, indice);
				}

			});
		}

	}

	eliminar(usuario: User, indice: number) {
		// console.table(usuario);

		// this.servUsuarios.eliminarUsuario(usuario).subscribe(data => {
			this.actualizarLista();
		this.eliminarPerfilesDelUsuario(usuario.idSegUsuario, usuario);
		this.eliminarRolesDelUsuario(usuario.idSegUsuario);
		this.actualizarLista();

		// });

	}

	eliminarRolesDelUsuario(idUsuario: number) {
		var rolesasig: any;

		/*var result : any;
		result = this.srvRolesUsuarios.getRolesAsignados(idUsuario);
		result.forEach(rn => {
		  this.srvRolesUsuarios.eliminarRolesAUsuario(rn).subscribe();
		});*/

		this.srvRolesUsuarios.getRolesAsignados(idUsuario).subscribe(
			data => {
				if (data.length > 0) {
					rolesasig = data;
					rolesasig.forEach(rn => {
						this.srvRolesUsuarios.eliminarRolesAUsuario(rn).subscribe();
					});
					this.actualizarLista();
				}
				
			}
		);
		//return true;
	}

	eliminarPerfilesDelUsuario(idUsuario: number, usuario: User) {
		var perfilesasig: any;
		this.srvPerfilesUsuarios.getPerfilesAsignados(idUsuario).subscribe(
			data => {
				if (data.length > 0) {
					perfilesasig = data;
					perfilesasig.forEach(perfil => {
						this.srvPerfilesUsuarios.eliminarPerfilesAUsuario(perfil).subscribe();
					});
					//this.actualizarLista();
				}
				this.servUsuarios.eliminarUsuario(usuario).subscribe(
					(data2) => {
						this.Usuario = null;
						this.servUsuarios.eliminarImagenUsuario(usuario.foto);
						//this.actualizarLista();
						this.messageService.clear();
						this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro eliminado' });
					}
				);
				this.actualizarLista();
			});
		return true;
	}

	actualizarLista() {
		//this.Usuarios = [];
		this.servUsuarios.getAll().subscribe(
			(data) => {
				//this.Usuarios = [];
				//this.Usuarios = data;

				/* Ajuste para el ordenamiento */
				data.forEach(usuario => {
					usuario.idSegUsuario = parseInt(usuario.idSegUsuario);
					//this.usuarios.push(usuario);
				});
				this.Usuarios = data
			}
		);
		this.rows = this.cant_filas_pag;
	}

	nuevoUsuario() {
		this.Usuario = null;
		this.Usuario = {};
		this.router.navigate(["usuarioform", (this.Usuario.idSegUsuario == null ? "-1" : this.Usuario.idSegUsuario)]);
	}

	modificarUsuario(usuario: User) {
		this.router.navigate(["usuarioform", usuario.idSegUsuario]);
	}

	clonar(usuario: User) {

		this.confirmationService.confirm({
			message: "¿Desea CLONAR el registro?",
			accept: () => {
				var cusuario: User;
				var rolesDelUsuario: RolesAsignadosUsrModelo[] = [];
				var perfilesDelUsuario: PerfilesAsignadosModelo[] = [];

				let idclone: number;
				//this.nuevoPerfilClon = null;
				idclone = usuario.idSegUsuario;
				cusuario = usuario;
				cusuario.idSegUsuario = null;
				cusuario.usuario += "(C)";
				cusuario.primerNombre += "(C)";
				cusuario.primerApellido += "(C)";
				cusuario.contrasenia = "1234";
				cusuario.foto = null;
				cusuario.rutaImagen = null;
				cusuario.fechaAlta = null;

				this.servUsuarios.nuevoUsuario(cusuario).subscribe(data => {
					let nuevoIdUserClonado: number;
					// console.log("nuevo: " + data["ObjectId"]);
					nuevoIdUserClonado = data["ObjectId"];
					cusuario.idSegUsuario =  data["ObjectId"];
					
					//Clonado los Roles
					this.srvRolesUsuarios.getRolesAsignados(idclone).subscribe(
						data => {
							rolesDelUsuario = data;
							// console.table(rolesDelUsuario);
							let cRolUsuario: RolesUsuariosModelo;
							rolesDelUsuario.forEach(rol => {
								cRolUsuario = { idSegUsuario: nuevoIdUserClonado, idSegRol: rol.idSegRol };
								this.srvRolesUsuarios.insertarRolesAUsuario(cRolUsuario).subscribe();
								cRolUsuario = null;
							});
							//this.actualizarLista();
						});

					//Clonando los perfiles
					this.srvPerfilesUsuarios.getPerfilesAsignados(idclone).subscribe(data => {
						perfilesDelUsuario = data;

						let cPerfilUsuario: PerfilesUsuarioModelo;
						perfilesDelUsuario.forEach(perfil => {
							cPerfilUsuario = { idSegPerfil: perfil.idSegPerfil, idSegUsuario: nuevoIdUserClonado }
							this.srvPerfilesUsuarios.insertarPerfilesAUsuario(cPerfilUsuario).subscribe();
							cPerfilUsuario = null;
						});
						this.actualizarLista();
					});

					//this.actualizarLista();
				});
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'USUARIO Clonado correctamente!!!. La clave por defecto es 1234' });
			}
		});

	}

}
