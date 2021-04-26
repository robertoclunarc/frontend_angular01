import { Component, OnInit} from '@angular/core';

import { User } from '../../models/user'
import { CargosModelo } from '../../models/cargos'
import { ActivatedRoute } from '@angular/router';
import { RolesNoAsignados } from "../../models/roles-no-asignados";
import { RolesAsignadosUsrModelo } from "../../models/roles-asignados-usr";
import { RolesUsuariosModelo } from "../../models/roles-usuarios";

import { PerfilesNoasignados } from "../../models/perfiles-noasignados";
import { PerfilesAsignadosModelo } from "../../models/perfiles-asignados";
import { PerfilesUsuarioModelo } from "../../models/perfiles-usuario";

import { GerenciasTemporales } from "../../models/gerencias-temporales";
import { GerenciasModelo } from "../../models/gerencias";

import { UserService } from '../../services/user.service'
import { CargosService } from '../../services/cargos.service'
import { MessageService, SelectItem } from 'primeng/api';
import { RolesUsuariosService } from '../../services/roles-usuarios.service'
import { PerfilesUsuarioService } from '../../services/perfiles-usuario.service'

import { ConfirmationService } from 'primeng/api';

import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

import { environment } from 'src/environments/environment';

import { Md5 } from "ts-md5/dist/md5";
import { GerenciasService } from 'src/app/services/gerencias.service';
import { GerenciasTemporalesService } from 'src/app/services/gerencias-temporales.service';



@Component({
	selector: 'app-usuario-form',
	templateUrl: './usuario-form.component.html',
	styleUrls: ['usuario-form.component.css'],
	providers: [UserService, MessageService, ConfirmationService, RolesUsuariosService, PerfilesUsuarioService]
})
export class UsuarioFormComponent implements OnInit {
	//@ViewChild('contra', { static: true }) contra;

	Usuarios: User[] = [];
	Usuario: User = {};

	rolesNoAsignados: RolesNoAsignados[] = [];
	rolesNASelected: RolesUsuariosModelo[] = [];
	rolesItems: SelectItem[] = [];

	rolesAsignados: RolesAsignadosUsrModelo[] = [];
	rolesASelected: RolesUsuariosModelo[] = [];
	rolesAItems: SelectItem[] = [];


	perfilesNoAsignados: PerfilesNoasignados[] = [];
	perfilesNASelected: PerfilesUsuarioModelo[] = [];
	perfilesItems: SelectItem[] = [];

	perfilesAsignados: PerfilesAsignadosModelo[] = [];
	perfilesASelected: PerfilesUsuarioModelo[] = [];
	perfilesAItems: SelectItem[] = [];

	gerenciasAsignados: GerenciasModelo[] = [];
	gerenciasAsigSelect: GerenciasTemporales[] = [];
	gerenciasAsigItems: SelectItem[] = [];

	gerenciasNoAsignados: GerenciasModelo[] = [];
	gerenciasNoAsigSelect: GerenciasTemporales[] = [];
	gerenciasNoAsigItems: SelectItem[] = [];

	idUsuario: number = -1;
	confirmacion: string;


	sexo: any[] = [];
	estadoCivil: any[] = [];
	cargos: CargosModelo[] = [];
	cargosItems: any[] = [];
	//cargo;

	es: any;
	dia: Date = new Date();
	cambioClave: boolean = false;

	API_subir_archivo: string = environment.apiUrl + "subirimagenusr";

	constructor(private servUsuarios: UserService, private servGCargo: CargosService, private messageService: MessageService, private rouactiva: ActivatedRoute,
		private confirmationService: ConfirmationService, private router: Router, private srvRolesUsuarios: RolesUsuariosService
		, private srvPerfilesUsuarios: PerfilesUsuarioService,
		private svrGerenciasTemp :  GerenciasTemporalesService) {
	}

	ngOnInit() {

		this.idUsuario = this.rouactiva.snapshot.params.idusuario;
		//this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
		this.cambioClave = false;
		this.servGCargo.getTodos().subscribe(data => {
			this.cargos = data;
			this.cargos.forEach(cargo => {
				this.cargosItems.push({
					label: cargo.nombre,
					value: cargo.idConfigCargo
				});
			});

			if (this.idUsuario == -1) {
				//let today = new Date();
				//console.log(formatDate(today, "yyyy-MM-dd", "en-US"));
				//this.Usuario.fechaNacimiento = new Date(formatDate(today, "yyyy-MM-dd", "en-US"));
			} else {
				this.servUsuarios.getUserById(this.idUsuario).subscribe(
					(data) => {
						this.Usuario = data[0];
						this.Usuario.estatus = (this.Usuario.estatus == 1 ? true : false);
						this.dia = new Date(this.Usuario.fechaNacimiento);
						cargo: Number(`${this.Usuario.idConfigCargo}`);
						this.actualizarGerenciasTempNOAsignados();
						this.actualizarGerenciasTempAsignados();
					}
				);
			}

			//cargo: Number(`${this.Usuario.idConfigCargo}`);
		});

		if (this.Usuario.rutaImagen == null) {
			this.API_subir_archivo = environment.apiUrl + "subirimagenusr/-1";
			//console.log("NOOPP imagen "+ this.API_subir_archivo);
		} else {
			//console.log("tiene imagen");
			this.API_subir_archivo = environment.apiUrl + "subirimagenusr/" + this.Usuario.foto;
		}


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

		this.sexo = [
			{ label: 'Masculino', value: 'M' },
			{ label: 'Femenino', value: 'F' }
		];

		this.estadoCivil = [
			{ label: 'Soltero', value: 'S' },
			{ label: 'Casado', value: 'C' },
			{ label: 'Viudo', value: 'V' },
			{ label: 'Divorciado', value: 'D' }
		];

		this.actualizarRolesAsignados();
		this.actualizarRolesNOAsignados();
		this.actualizarPerfilesAsignados();
		this.actualizarPerfilesNOAsignados();
		

	}

	handleChange(e, usuario: User) {
		usuario.estatus = (e.checked == true ? 1 : 0)
	}

	actualizarRolesNOAsignados() {
		this.rolesNoAsignados = [];
		this.rolesNASelected = [];
		this.srvRolesUsuarios.getRolesNoAsignados(this.idUsuario).subscribe(
			data => {
				this.rolesNoAsignados = data;
				//console.table(data);
				this.rolesItems = [];
				this.rolesNoAsignados.forEach(rn => {
					this.rolesItems.push({
						label: rn.nombreRol,
						value: { idSegRol: rn.idSegRol, idSegUsuario: this.idUsuario }
					});
					//console.log(this.rolesItems);
				});
			}
		);
	}

	actualizarRolesAsignados() {
		this.rolesAsignados = [];
		this.rolesASelected = [];
		this.srvRolesUsuarios.getRolesAsignados(this.idUsuario).subscribe(
			data => {
				this.rolesAsignados = data;
				//console.table(data);
				this.rolesAItems = [];
				this.rolesAsignados.forEach(rn => {
					this.rolesAItems.push({
						label: rn.nombreRol,
						value: { idSegRol: rn.idSegRol, idSegUsuario: this.idUsuario }
					});
				});
			}
		);
	}

	actualizarPerfilesNOAsignados() {
		this.perfilesNoAsignados = [];
		this.perfilesNASelected = [];
		this.srvPerfilesUsuarios.getPerfilesNoAsignados(this.idUsuario).subscribe(
			data => {
				this.perfilesNoAsignados = data;
				//console.table(data);
				this.perfilesItems = [];
				this.perfilesNoAsignados.forEach(pn => {
					this.perfilesItems.push({
						label: pn.nombreper,
						value: { idSegPerfil: pn.idSegPerfil, idSegUsuario: this.idUsuario }
					});
					//console.log(this.rolesItems);
				});
			}
		);
	}

	actualizarPerfilesAsignados() {
		this.perfilesAsignados = [];
		this.perfilesASelected = [];
		this.srvPerfilesUsuarios.getPerfilesAsignados(this.idUsuario).subscribe(
			data => {
				this.perfilesAsignados = data;
				//console.table(data);
				this.perfilesAItems = [];
				this.perfilesAsignados.forEach(pa => {
					this.perfilesAItems.push({
						label: pa.nombrePerfil,
						value: { idSegPerfil: pa.idSegPerfil, idSegUsuario: this.idUsuario }
					});
				});
			}
		);
	}

	volver() {
		this.router.navigate(["usuarios"]);
	}

	cambio(e) {
		this.cambioClave = true;
	}

	guardarUsuario() {

		this.Usuario.estatus = (this.Usuario.estatus == true ? 1 : 0);
		this.Usuario.fechaNacimiento = formatDate(this.dia, "yyyy-MM-dd", "en-US");

		if (this.Usuario.primerNombre == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar un nombre' });
			return false;
		}
		if (this.Usuario.primerApellido == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar un apellido' });
			return false;
		}
		if (this.Usuario.usuario == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar Nombre de usuario que lo identifique' });
			return false;
		}
		if (this.Usuario.contrasenia == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar una contraseña' });
			return false;
		}

		if (this.Usuario.idConfigCargo == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el cargo del usuario' });
			return false;
		}



		if (this.Usuario.idSegUsuario == null) {
			//console.log(this.Usuario);
			const md5Pass = String(Md5.hashStr(this.Usuario.contrasenia));
			this.Usuario.contrasenia = md5Pass;
			this.servUsuarios.nuevoUsuario(this.Usuario).subscribe(data => {
				//console.log(data);
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Usuario Registrado Satisfactoriamente' });
				this.idUsuario = data["ObjectId"];
				this.Usuario.idSegUsuario = data["ObjectId"];
				this.actualizarRolesAsignados();
				this.actualizarRolesNOAsignados();
				this.actualizarPerfilesAsignados();
				this.actualizarPerfilesNOAsignados();

			});

		} else {
			//console.table(this.Usuario);
			//console.log("value: " + this.contra.nativeElement.value);
			//console.log("datos: " + this.Usuario.contrasenia);

			if (this.cambioClave) {
				///console.log("entrooooo");
				const md5Pass = String(Md5.hashStr(this.Usuario.contrasenia));
				this.Usuario.contrasenia = md5Pass;
			}

			this.servUsuarios.actualizarUsuario(this.Usuario).subscribe(data => {
				this.refrescarUser();
			});
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Usuario Actualizado Satisfactoriamente' });
		}
	}

	refrescarUser() {
		this.servUsuarios.getUserById(this.idUsuario).subscribe(
			(data) => {
				this.Usuario = data[0];
				this.Usuario.estatus = (this.Usuario.estatus == 1 ? true : false);
				this.dia = new Date(this.Usuario.fechaNacimiento);
				cargo: Number(`${this.Usuario.idConfigCargo}`);
			}
		);
	}

	asignarRoles() {
		//console.table(this.rolesNASelected);
		this.rolesNASelected.forEach(rolPerfil => {
			this.srvRolesUsuarios.insertarRolesAUsuario(rolPerfil).subscribe(result => {
				this.actualizarRolesAsignados();
				this.actualizarRolesNOAsignados();
			});

		});

		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados Satisfactoriamente' });
	}

	quitarRoles() {
		//console.table(this.rolesASelected);
		this.rolesASelected.forEach(rolPerfil => {
			this.srvRolesUsuarios.eliminarRolesAUsuario(rolPerfil).subscribe(result => {
				this.actualizarRolesAsignados();
				this.actualizarRolesNOAsignados();

			});
		});
		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados Satisfactoriamente' });
	}

	asignarPerfiles() {
		//console.table(this.rolesNASelected);
		this.perfilesNASelected.forEach(perfilUsuario => {
			this.srvPerfilesUsuarios.insertarPerfilesAUsuario(perfilUsuario).subscribe(result => {
				this.actualizarPerfilesAsignados();
				this.actualizarPerfilesNOAsignados();
			});

		});

		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados Satisfactoriamente' });
	}

	quitarPerfiles() {
		//console.table(this.rolesASelected);
		this.perfilesASelected.forEach(perfilUsario => {
			this.srvPerfilesUsuarios.eliminarPerfilesAUsuario(perfilUsario).subscribe(result => {
				this.actualizarPerfilesAsignados();
				this.actualizarPerfilesNOAsignados();

			});
		});
		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados Satisfactoriamente' });
	}

	antesSubirArchivo(e) {
		//console.log("eeee imagen");
		//console.log(e.formData);

		if (this.Usuario.rutaImagen == null) {

			this.API_subir_archivo = environment.dirImgsSubidas + "subirimagenusr/-1";
			//console.log("NOOPP imagen " + this.API_subir_archivo);
		} else {
			//console.log("tiene imagen");
			this.API_subir_archivo = environment.dirImgsSubidas + "/" + this.Usuario.foto;
		}
	}

	despuesCargarArchivo(e) {
		this.Usuario.rutaImagen = environment.dirImgsSubidas + "fotosusers/" + e.files[0].name;
		this.Usuario.foto = e.files[0].name;
	}

	asignarGerenciasTemp() {
		//console.table(this.rolesNASelected);
		this.gerenciasNoAsigSelect.forEach(gnoasig => {
			this.svrGerenciasTemp.nuevaGerenciaTempUsuario(gnoasig).then(result => {
				this.actualizarGerenciasTempAsignados();
				this.actualizarGerenciasTempNOAsignados();
			});

		});

		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados Satisfactoriamente' });
		//console.table(this.gerenciasNoAsigSelect);
	}

	quitarGerenciasTemp(){
		this.gerenciasAsigSelect.forEach(gerA => {
			this.svrGerenciasTemp.borrarGerenciaTempUsuario(gerA).then(result => {
				this.actualizarGerenciasTempAsignados();
				this.actualizarGerenciasTempNOAsignados();

			});
		});
		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados Satisfactoriamente' });
		//console.table(this.gerenciasAsigSelect);
	}

	actualizarGerenciasTempNOAsignados() {
		this.gerenciasNoAsignados = [];
		this.gerenciasNoAsigSelect = [];
		
		this.svrGerenciasTemp.getGerenciasTempNOIngresadas(this.idUsuario, this.Usuario.idConfigCargo).then (
			data => {
				this.gerenciasNoAsignados = data;
				//console.table(data);
				this.gerenciasNoAsigItems = [];
				this.gerenciasNoAsignados.forEach(gtn => {
					this.gerenciasNoAsigItems.push({
						label: gtn.nombre,
						value: { idSegUsuario : this.idUsuario,  idConfigGerencia : gtn.idConfigGerencia}
					});
					//console.log(this.rolesItems);
				});
			}
		);
	}

	actualizarGerenciasTempAsignados() {
		this.gerenciasAsignados = [];
		this.gerenciasAsigSelect = [];
		this.svrGerenciasTemp.getGerenciasTempIngresadas(this.idUsuario).then(
			data => {
				this.gerenciasAsignados = data;
				//console.table(data);
				this.gerenciasAsigItems = [];
				this.gerenciasAsignados.forEach(gta => {
					this.gerenciasAsigItems.push({
						label: gta.nombre, 
						value: { idSegUsuario: this.idUsuario, idConfigGerencia : gta.idConfigGerencia }
					});
				});
			}
		);
	}

}
